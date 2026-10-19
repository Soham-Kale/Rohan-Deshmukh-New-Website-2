import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyVisionMenuAndBook } from '../seed/content-updates'

/** Content migration (19 Oct 2026): Vision becomes its own menu item after Media; Vision page book section shows the New India Manifesto cover */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyVisionMenuAndBook(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
