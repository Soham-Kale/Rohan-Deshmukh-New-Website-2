import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyHomeLayout } from '../seed/home-layout'

/**
 * Content migration (17 Oct 2026): puts the family section back into the homepage data as a hidden section.
 * It stays off the homepage, but the कौटुंबिक पार्श्वभूमी page (/about/family) reads its content from it.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyHomeLayout(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
