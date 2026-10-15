import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyDocTextUpdates } from '../seed/content-updates'

/** Content migration: updated text from the client document (family, Lokmangal Parivar, political career) */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyDocTextUpdates(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
