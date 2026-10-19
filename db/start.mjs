/**
 * Data tier — starts the PostgreSQL server for local development.
 *
 *   npm run db            (from the project root)  or  npm start  (inside db/)
 *
 * Runs a private PostgreSQL server (no install or account needed) with its data in db/.postgres-data,
 * creates the database named in DATABASE_URI (db/.env) and keeps running until Ctrl+C.
 * Only the backend connects to it — the website never talks to the database directly.
 *
 * Using Docker or a hosted Postgres (Neon, Supabase…) instead? Point the backend's DATABASE_URI at it
 * and don't run this (see db/README.md and db/docker-compose.yml).
 */
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import dotenv from 'dotenv'
import EmbeddedPostgres from 'embedded-postgres'
import pg from 'pg'

const here = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(here, '.env'), quiet: true })

/** Connection settings from DATABASE_URI (db/.env) */
export function dbSettings(uri = process.env.DATABASE_URI) {
  if (!uri) throw new Error('DATABASE_URI is missing in db/.env (copy db/.env.example to db/.env first)')
  const url = new URL(uri)
  return {
    uri,
    local: ['localhost', '127.0.0.1'].includes(url.hostname),
    host: url.hostname,
    port: Number(url.port || 5432),
    dbName: url.pathname.replace(/^\//, '') || 'rohan',
    user: decodeURIComponent(url.username || 'postgres'),
    password: decodeURIComponent(url.password || 'postgres'),
  }
}

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

const createSql = (name) => `CREATE DATABASE "${name.replace(/"/g, '')}" WITH ENCODING 'UTF8' LC_COLLATE 'C' LC_CTYPE 'C' TEMPLATE template0`

/**
 * Start (or reuse) the local PostgreSQL server. Returns a `stop()` function.
 * A server left running by an earlier window is reused instead of starting a second one.
 */
export async function startDb({ log = console.log } = {}) {
  const s = dbSettings()
  if (!s.local) {
    log(`🐘 Using external PostgreSQL at ${s.host} (nothing to start)`)
    return { stop: async () => {} }
  }

  const adminUri = new URL(s.uri)
  adminUri.pathname = '/postgres'
  if (await canConnect(adminUri.toString())) {
    log(`🐘 Using the PostgreSQL server already running on localhost:${s.port}`)
    const client = new pg.Client({ connectionString: adminUri.toString() })
    await client.connect()
    const found = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [s.dbName])
    if (!found.rowCount) await client.query(createSql(s.dbName))
    await client.end()
    return { stop: async () => {} }
  }

  const dataDir = path.join(here, '.postgres-data')
  const server = new EmbeddedPostgres({
    databaseDir: dataDir, user: s.user, password: s.password, port: s.port, persistent: true,
    // Marathi text needs UTF-8 (Windows would otherwise default to a WIN1252 database)
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
    onLog: () => {}, onError: () => {},
  })
  if (!existsSync(path.join(dataDir, 'PG_VERSION'))) {
    log('🐘 Setting up the PostgreSQL data folder (first run only)…')
    await server.initialise()
  }
  try {
    await server.start()
  } catch (e) {
    log(`\n✖ Could not start PostgreSQL on port ${s.port}. Another program may be using it.`)
    log('  Change the port in DATABASE_URI (db/.env and backend/.env, e.g. localhost:5433) and try again.\n')
    throw e
  }
  const client = server.getPgClient()
  await client.connect()
  const found = await client.query('SELECT pg_encoding_to_char(encoding) AS enc FROM pg_database WHERE datname = $1', [s.dbName])
  if (!found.rowCount) await client.query(createSql(s.dbName))
  else if (found.rows[0].enc !== 'UTF8') {
    log(`🐘 Re-creating database "${s.dbName}" with UTF-8 encoding…`)
    await client.query(`DROP DATABASE "${s.dbName.replace(/"/g, '')}" WITH (FORCE)`)
    await client.query(createSql(s.dbName))
  }
  await client.end()
  log(`🐘 PostgreSQL running on localhost:${s.port} (database "${s.dbName}")`)
  return { stop: () => server.stop().catch(() => {}) }
}

// ---- run directly: start and keep running until Ctrl+C
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { stop } = await startDb()
    console.log('Database ready. Press Ctrl+C to stop.')
    const quit = async () => {
      console.log('\n🐘 Stopping PostgreSQL…')
      await stop()
      process.exit(0)
    }
    process.on('SIGINT', quit)
    process.on('SIGTERM', quit)
    setInterval(() => {}, 1 << 30) // keep the process alive
  } catch (e) {
    console.error(e?.message ?? e)
    process.exit(1)
  }
}
