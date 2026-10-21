import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

export const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const projectRoot = path.resolve(backendRoot, '..')

/** Load backend/.env (never overrides variables that are already set, e.g. by the host or by tests) */
dotenv.config({ path: path.join(backendRoot, '.env'), quiet: true })

const bool = (v, fallback = false) => (v === undefined || v === '' ? fallback : /^(1|true|yes|on)$/i.test(String(v)))
const int = (v, fallback) => (Number.isFinite(Number(v)) && v !== '' && v !== undefined ? Number(v) : fallback)
const trimSlash = (u) => String(u || '').replace(/\/+$/, '')
const list = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean)

/** mysql://user:pass@host:3306/name → connection parts */
function parseDatabaseUrl(url) {
  try {
    const u = new URL(url)
    return {
      dialect: u.protocol.replace(':', '').startsWith('mysql') ? 'mysql' : 'sqlite',
      host: u.hostname,
      port: u.port ? Number(u.port) : 3306,
      name: decodeURIComponent(u.pathname.replace(/^\//, '')),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
    }
  } catch {
    return {}
  }
}

/** Reads the environment each time, so tests can change variables before building an app */
export function loadConfig(env = process.env) {
  const nodeEnv = env.NODE_ENV || 'development'
  const production = nodeEnv === 'production'
  const publicUrl = trimSlash(env.PUBLIC_URL || (production ? '' : 'http://localhost:3000'))
  const fromUrl = env.DATABASE_URL ? parseDatabaseUrl(env.DATABASE_URL) : {}
  const dialect = (env.DB_DIALECT || fromUrl.dialect || 'sqlite').toLowerCase()
  const frontendDist = path.resolve(backendRoot, env.FRONTEND_DIST || '../frontend/dist')

  const cfg = {
    nodeEnv,
    production,
    test: nodeEnv === 'test',
    port: int(env.PORT, 3001),
    logRequests: bool(env.LOG_REQUESTS, !production),
    rateLimitDisabled: bool(env.RATE_LIMIT_DISABLED, nodeEnv === 'test'),
    autoMigrate: bool(env.AUTO_MIGRATE, true),
    publicUrl,
    corsOrigins: list(env.CORS_ORIGINS).map(trimSlash),
    trustProxy: env.TRUST_PROXY === undefined || env.TRUST_PROXY === '' ? false : /^\d+$/.test(env.TRUST_PROXY) ? Number(env.TRUST_PROXY) : bool(env.TRUST_PROXY, false) ? true : env.TRUST_PROXY,

    bcryptRounds: nodeEnv === 'test' ? 4 : 12, // password hashing cost (kept low only in tests)
    jwtSecret: env.JWT_SECRET || '',
    jwtExpiresInSeconds: int(env.JWT_EXPIRES_HOURS, 8) * 3600,
    cookieName: env.COOKIE_NAME || 'rd_token',
    cookieSecure: bool(env.COOKIE_SECURE, publicUrl.startsWith('https://')),
    cookieSameSite: (env.COOKIE_SAMESITE || 'lax').toLowerCase(),

    db: {
      dialect,
      sqlitePath: env.SQLITE_PATH === ':memory:' ? ':memory:' : path.resolve(backendRoot, env.SQLITE_PATH || 'data/rohan.sqlite'),
      host: env.DB_HOST || fromUrl.host || 'localhost',
      port: int(env.DB_PORT, fromUrl.port || 3306),
      name: env.DB_NAME || fromUrl.name || 'rohan',
      user: env.DB_USER || fromUrl.user || 'root',
      password: env.DB_PASSWORD ?? fromUrl.password ?? '',
      ssl: bool(env.DB_SSL, false),
    },

    storage: {
      driver: (env.STORAGE_DRIVER || 'local').toLowerCase(),
      dir: path.resolve(backendRoot, env.UPLOAD_DIR || 'uploads'),
      s3: {
        bucket: env.S3_BUCKET || '',
        region: env.S3_REGION || 'ap-south-1',
        endpoint: env.S3_ENDPOINT || undefined,
        accessKeyId: env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: env.S3_SECRET_ACCESS_KEY || '',
        forcePathStyle: bool(env.S3_FORCE_PATH_STYLE, false),
        prefix: String(env.S3_PREFIX || '').replace(/^\/+|\/+$/g, ''),
        publicUrl: trimSlash(env.S3_PUBLIC_URL || ''),
      },
    },

    mail: {
      host: env.SMTP_HOST || '',
      port: int(env.SMTP_PORT, 587),
      secure: bool(env.SMTP_SECURE, false),
      user: env.SMTP_USER || '',
      pass: env.SMTP_PASS || '',
      from: env.EMAIL_FROM || 'Rohan Deshmukh <noreply@rohandeshmukh.in>',
    },

    recaptchaSecret: env.RECAPTCHA_SECRET_KEY || '',
    admin: { email: env.ADMIN_EMAIL || 'admin@rohandeshmukh.in', password: env.ADMIN_PASSWORD || 'ChangeMe@123' },

    frontendDist,
    serveFrontend: bool(env.SERVE_FRONTEND, existsSync(path.join(frontendDist, 'index.html'))),
    backupCron: env.BACKUP_CRON === undefined ? (dialect === 'sqlite' && production ? '30 2 * * *' : '') : env.BACKUP_CRON,
    backupDir: path.resolve(backendRoot, env.BACKUP_DIR || 'backups'),
    backupKeep: int(env.BACKUP_KEEP, 14),
  }

  if (!cfg.jwtSecret) {
    if (production) throw new Error('JWT_SECRET must be set in production (a long random string)')
    cfg.jwtSecret = 'dev-only-secret-change-me'
  }
  if (production && cfg.jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters in production')
  if (cfg.storage.driver === 's3' && (!cfg.storage.s3.bucket || !cfg.storage.s3.accessKeyId)) {
    throw new Error('STORAGE_DRIVER=s3 needs S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY')
  }
  return cfg
}
