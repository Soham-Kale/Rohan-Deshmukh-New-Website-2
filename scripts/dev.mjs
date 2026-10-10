/**
 * One-command local development:
 *   1. starts a private PostgreSQL server inside this project (no install / account needed)
 *   2. creates the database and loads the website content on first run
 *   3. starts the Next.js dev server (website + admin panel)
 *
 * Uses the user, password, port and database name from DATABASE_URI in .env.
 * Set USE_EMBEDDED_DB=false in .env to use your own PostgreSQL / Neon instead.
 */
import 'dotenv/config'
import { spawn } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import EmbeddedPostgres from 'embedded-postgres'
import pg from 'pg'

const root = path.resolve(import.meta.dirname, '..')
const onlyDb = process.argv.includes('--db-only')
const prod = process.argv.includes('--prod') // fast production preview (what visitors get)
const uri = process.env.DATABASE_URI
if (!uri) {
  console.error('\n✖ DATABASE_URI is missing in .env (copy .env.example to .env first)\n')
  process.exit(1)
}
if (!process.env.PAYLOAD_SECRET) {
  console.error('\n✖ PAYLOAD_SECRET is missing in .env — set it to any long random text\n')
  process.exit(1)
}

const url = new URL(uri)
const local = ['localhost', '127.0.0.1'].includes(url.hostname)
const embedded = local && process.env.USE_EMBEDDED_DB !== 'false'
const dbName = url.pathname.replace(/^\//, '') || 'rohan'
const port = Number(url.port || 5432)
const user = decodeURIComponent(url.username || 'postgres')
const password = decodeURIComponent(url.password || 'postgres')

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', ...opts })
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))))
  })

let server = null
async function canConnect(connectionString) {
  const c = new pg.Client({ connectionString, connectionTimeoutMillis: 3000 })
  try {
    await c.connect()
    await c.end()
    return true
  } catch {
    return false
  }
}

async function startDb() {
  // A database left running by an earlier window (crash / closed terminal) is simply reused
  const adminUri = new URL(uri)
  adminUri.pathname = '/postgres'
  if (await canConnect(adminUri.toString())) {
    console.log(`🐘 Using the PostgreSQL server already running on localhost:${port}`)
    const client = new pg.Client({ connectionString: adminUri.toString() })
    await client.connect()
    const found = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
    if (!found.rowCount) await client.query(`CREATE DATABASE "${dbName.replace(/"/g, '')}" WITH ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0`)
    await client.end()
    return
  }
  const dataDir = path.join(root, '.postgres-data')
  server = new EmbeddedPostgres({
    databaseDir: dataDir, user, password, port, persistent: true,
    // Marathi text needs UTF-8 (Windows would otherwise default to a WIN1252 database)
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
    onLog: () => {}, onError: () => {},
  })
  if (!existsSync(path.join(dataDir, 'PG_VERSION'))) {
    console.log('🐘 Setting up the built-in PostgreSQL database (first run only)…')
    await server.initialise()
  }
  try {
    await server.start()
  } catch (e) {
    console.error(`\n✖ Could not start PostgreSQL on port ${port}. Another program may be using it.`)
    console.error(`  Change the port in DATABASE_URI (e.g. localhost:5433) and try again.\n`)
    throw e
  }
  const client = server.getPgClient()
  await client.connect()
  const safe = dbName.replace(/"/g, '')
  const create = () => client.query(`CREATE DATABASE "${safe}" WITH ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0`)
  const found = await client.query('SELECT pg_encoding_to_char(encoding) AS enc FROM pg_database WHERE datname = $1', [dbName])
  if (!found.rowCount) await create()
  else if (found.rows[0].enc !== 'UTF8') {
    console.log(`🐘 Re-creating database "${dbName}" with UTF-8 encoding…`)
    await client.query(`DROP DATABASE "${safe}" WITH (FORCE)`)
    await create()
  }
  await client.end()
  console.log(`🐘 PostgreSQL running on localhost:${port} (database "${dbName}")`)
}

async function hasContent() {
  const client = new pg.Client({ connectionString: uri })
  await client.connect()
  try {
    const r = await client.query(`SELECT to_regclass('public.pages') AS t`)
    if (!r.rows[0].t) return false
    const c = await client.query('SELECT count(*)::int AS n FROM pages')
    return c.rows[0].n > 0
  } finally {
    await client.end()
  }
}

/** A crashed/duplicate server can leave half-written JSON in the build folder */
function manifestsOk(dir) {
  if (!existsSync(dir)) return true
  for (const f of ['prerender-manifest.json', 'build-manifest.json', 'routes-manifest.json']) {
    const p = path.join(dir, f)
    if (!existsSync(p)) continue
    try { JSON.parse(readFileSync(p, 'utf8')) } catch { return false }
  }
  return true
}

function clearDir(dir) {
  try {
    rmSync(dir, { recursive: true, force: true, maxRetries: 3 })
  } catch {
    console.error(`\n✖ Could not clear ${path.basename(dir)} — another copy of the website is still running and has it locked.`)
    console.error('  Close every terminal / VS Code window running the website and try again.\n')
    process.exit(1)
  }
}

/** Rebuild only when the code changed since the last production build */
function needsBuild(dir) {
  const id = path.join(dir, 'BUILD_ID')
  if (!existsSync(id) || !manifestsOk(dir)) return true
  const built = statSync(id).mtimeMs
  const newer = (p) => {
    const st = statSync(p)
    if (st.isDirectory()) return readdirSync(p).some((f) => newer(path.join(p, f)))
    return st.mtimeMs > built
  }
  return ['src', 'public', 'next.config.mjs', 'package.json', '.env'].some((p) => existsSync(path.join(root, p)) && newer(path.join(root, p)))
}

let stopping = false
async function stop(code = 0) {
  if (stopping) return
  stopping = true
  if (server) {
    console.log('\n🐘 Stopping PostgreSQL…')
    await server.stop().catch(() => {})
  }
  process.exit(code)
}
process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))

try {
  if (embedded) await startDb()
  else console.log(`Using external PostgreSQL at ${url.hostname}`)

  if (!(await hasContent())) {
    console.log('🌱 Empty database — loading website content (takes 1–3 minutes)…')
    await run('node', ['--env-file=.env', '--import', 'tsx', 'src/seed/index.ts'])
  }

  if (!onlyDb) {
    // Only one copy of the website may run at a time
    const webPort = Number(process.env.PORT || 3000)
    const busy = await new Promise((resolve) => {
      const t = net.createServer().once('error', () => resolve(true)).once('listening', () => t.close(() => resolve(false)))
      t.listen(webPort)
    })
    if (busy) {
      console.error(`\n✖ Port ${webPort} is already in use — the website is probably already running in another window`)
      console.error('  (for example an "npm run dev" in the VS Code terminal). Stop it with Ctrl+C, close that window, and run this again.\n')
      await stop(1)
    }
  }

  if (onlyDb) {
    console.log('Database ready. Press Ctrl+C to stop.')
  } else if (prod) {
    const distDir = path.join(root, '.next')
    if (needsBuild(distDir)) {
      console.log('🏗️  Building the optimised website (2–5 minutes, only after code changes)…')
      clearDir(distDir)
      await run('npx', ['next', 'build'], { env: { ...process.env, NEXT_DIST_DIR: '.next', NODE_ENV: 'production' } })
    } else console.log('✓ Using existing optimised build')
    const next = spawn('npx', ['next', 'start'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, NEXT_DIST_DIR: '.next', NODE_ENV: 'production' } })
    next.on('exit', (code) => stop(code ?? 0))
  } else {
    // Development: Turbopack (much faster compiles) in its own build folder
    const distDir = path.join(root, '.next-dev')
    if (!manifestsOk(distDir)) clearDir(distDir)
    const next = spawn('npx', ['next', 'dev', '--turbopack'], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, NEXT_DIST_DIR: '.next-dev' } })
    next.on('exit', (code) => stop(code ?? 0))
  }
} catch (e) {
  console.error(e?.message ?? e)
  await stop(1)
}
