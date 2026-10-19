/**
 * One command for the whole three-tier site:
 *   npm run dev       development (code changes appear instantly)
 *   npm run preview   fast production build (rebuilt only after code changes)
 *
 *   1. db        — starts the private PostgreSQL server (db/start.mjs), unless an external database is configured
 *   2. backend   — Payload CMS + API on http://localhost:3001 (admin at /admin); loads content on first run
 *   3. frontend  — the public website on http://localhost:3000, reading content from the backend's API
 */
import { spawn } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import dotenv from 'dotenv'
import pg from 'pg'
import { startDb } from '../db/start.mjs'

const root = path.resolve(import.meta.dirname, '..')
const prod = process.argv.includes('--prod')
const tier = (name) => path.join(root, name)

for (const t of ['db', 'backend', 'frontend']) {
  if (!existsSync(path.join(tier(t), '.env'))) {
    console.error(`\n✖ ${t}/.env is missing — copy ${t}/.env.example to ${t}/.env first\n`)
    process.exit(1)
  }
}
const backendEnv = dotenv.parse(readFileSync(path.join(tier('backend'), '.env')))
if (!backendEnv.DATABASE_URI || !backendEnv.PAYLOAD_SECRET) {
  console.error('\n✖ DATABASE_URI and PAYLOAD_SECRET must be set in backend/.env\n')
  process.exit(1)
}

const run = (cmd, args, opts = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', ...opts })
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited with ${code}`))))
  })

async function hasContent() {
  const client = new pg.Client({ connectionString: backendEnv.DATABASE_URI })
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

const portBusy = (port) =>
  new Promise((resolve) => {
    const t = net.createServer().once('error', () => resolve(true)).once('listening', () => t.close(() => resolve(false)))
    t.listen(port)
  })

/** A crashed/duplicate server can leave half-written JSON in a build folder */
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
    console.error(`\n✖ Could not clear ${path.relative(root, dir)} — another copy of the site is still running and has it locked.`)
    console.error('  Close every terminal / VS Code window running the website and try again.\n')
    process.exit(1)
  }
}

/** Rebuild a tier only when its code changed since its last production build */
function needsBuild(app, extra = []) {
  const id = path.join(tier(app), '.next', 'BUILD_ID')
  if (!existsSync(id) || !manifestsOk(path.join(tier(app), '.next'))) return true
  const built = statSync(id).mtimeMs
  const newer = (p) => {
    const st = statSync(p)
    if (st.isDirectory()) return readdirSync(p).some((f) => newer(path.join(p, f)))
    return st.mtimeMs > built
  }
  return ['src', 'public', 'next.config.mjs', 'package.json', '.env', ...extra].map((p) => path.join(tier(app), p)).some((p) => existsSync(p) && newer(p))
}

let db = null
const children = []
let stopping = false
async function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const c of children) c.kill()
  if (db) {
    console.log('\n🐘 Stopping PostgreSQL…')
    await db.stop()
  }
  process.exit(code)
}
process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))

/** start a long-running tier; if it exits, everything stops */
function serve(name, args, env = {}) {
  const child = spawn('npm', args, { cwd: tier(name), stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, ...env } })
  child.on('exit', (code) => stop(code ?? 0))
  children.push(child)
  return child
}

async function waitFor(url, label, seconds = 600) {
  const end = Date.now() + seconds * 1000
  while (Date.now() < end) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (res.status < 500) return
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 2000))
  }
  throw new Error(`${label} did not start within ${seconds}s`)
}

try {
  // ---- 1. data tier
  db = await startDb()

  // ---- content: first run loads everything; later runs apply new content changes once per version
  const contentVersion = readFileSync(path.join(tier('backend'), 'src/seed/content-updates.ts'), 'utf8').match(/CONTENT_VERSION = '([^']+)'/)?.[1] ?? ''
  const marker = path.join(root, '.content-version')
  const dbUrl = new URL(backendEnv.DATABASE_URI)
  const stamp = `${contentVersion} ${dbUrl.hostname}:${dbUrl.port || 5432}${dbUrl.pathname}`
  if (!(await hasContent())) {
    console.log('🌱 Empty database — loading website content (takes 1–3 minutes)…')
    await run('npm', ['run', 'seed'], { cwd: tier('backend') })
    writeFileSync(marker, stamp)
  } else if (contentVersion && (!existsSync(marker) || readFileSync(marker, 'utf8').trim() !== stamp)) {
    console.log('🔄 Applying the latest menu and page changes to the database…')
    try {
      await run('npm', ['run', 'content:update'], { cwd: tier('backend') })
      writeFileSync(marker, stamp)
    } catch {
      console.warn('⚠ Could not apply the content changes — run "npm run content:update" later.')
    }
  }

  // ---- only one copy of the site may run at a time
  for (const [port, name] of [[3001, 'backend'], [3000, 'website']]) {
    if (await portBusy(port)) {
      console.error(`\n✖ Port ${port} (${name}) is already in use — the site is probably already running in another window.`)
      console.error('  Stop it with Ctrl+C, close that window, and run this again.\n')
      await stop(1)
    }
  }

  if (prod) {
    // ---- production preview: build what changed, then start both apps
    if (needsBuild('backend')) {
      console.log('🏗️  Building the backend (2–4 minutes, only after code changes)…')
      clearDir(path.join(tier('backend'), '.next'))
      await run('npm', ['run', 'build'], { cwd: tier('backend'), env: { ...process.env, NODE_ENV: 'production' } })
    } else console.log('✓ Using the existing backend build')
    serve('backend', ['run', 'start'], { NODE_ENV: 'production' })
    await waitFor('http://localhost:3001/api/globals/site-settings', 'The backend')
    // the website reads content from the backend while it builds, so the backend starts first
    if (needsBuild('frontend', ['../backend/src/payload-types.ts'])) {
      console.log('🏗️  Building the website (2–4 minutes, only after code changes)…')
      clearDir(path.join(tier('frontend'), '.next'))
      await run('npm', ['run', 'build'], { cwd: tier('frontend'), env: { ...process.env, NODE_ENV: 'production' } })
    } else console.log('✓ Using the existing website build')
    serve('frontend', ['run', 'start'], { NODE_ENV: 'production' })
  } else {
    // ---- development (Turbopack); each app keeps its dev build in .next-dev
    for (const t of ['backend', 'frontend']) if (!manifestsOk(path.join(tier(t), '.next-dev'))) clearDir(path.join(tier(t), '.next-dev'))
    serve('backend', ['run', 'dev'])
    await waitFor('http://localhost:3001/api/globals/site-settings', 'The backend')
    serve('frontend', ['run', 'dev'])
  }
  console.log('\n  Website      → http://localhost:3000')
  console.log('  Admin panel  → http://localhost:3001/admin')
  console.log('  Content API  → http://localhost:3001/api\n')
} catch (e) {
  console.error(e?.message ?? e)
  await stop(1)
}
