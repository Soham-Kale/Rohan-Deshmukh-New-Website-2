import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { Sequelize } from 'sequelize'
import { buildModels } from './models.js'
import { runMigrations } from './migrate.js'

/**
 * Opens the database: SQLite for local development (a single file, zero setup),
 * MySQL for production. Same models and same code for both.
 */
export function createSequelize(cfg) {
  const { db } = cfg
  if (db.dialect === 'mysql') {
    return new Sequelize(db.name, db.user, db.password, {
      host: db.host,
      port: db.port,
      dialect: 'mysql',
      logging: false,
      timezone: '+00:00',
      dialectOptions: { charset: 'utf8mb4', ...(db.ssl ? { ssl: { rejectUnauthorized: true } } : {}) },
      define: { charset: 'utf8mb4', collate: 'utf8mb4_unicode_ci' },
      pool: { max: 10, min: 0, idle: 10_000, acquire: 30_000 },
    })
  }
  if (db.sqlitePath !== ':memory:') mkdirSync(path.dirname(db.sqlitePath), { recursive: true })
  return new Sequelize({ dialect: 'sqlite', storage: db.sqlitePath, logging: false })
}

export async function createDatabase(cfg) {
  const sequelize = createSequelize(cfg)
  await sequelize.authenticate()
  if (cfg.db.dialect === 'sqlite') {
    // WAL: readers never block the writer; busy_timeout: wait instead of failing when two requests write at once
    if (cfg.db.sqlitePath !== ':memory:') await sequelize.query('PRAGMA journal_mode = WAL')
    await sequelize.query('PRAGMA busy_timeout = 5000')
    await sequelize.query('PRAGMA synchronous = NORMAL')
  }
  const models = buildModels(sequelize)
  return {
    sequelize,
    ...models,
    dialect: cfg.db.dialect,
    migrate: () => runMigrations(sequelize),
    close: () => sequelize.close(),
  }
}
