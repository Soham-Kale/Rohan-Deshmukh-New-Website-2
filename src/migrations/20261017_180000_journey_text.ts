import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyHomeLayout } from '../seed/home-layout'

/** Content migration (17 Oct 2026): new text for the homepage ‘His Journey’ section */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyHomeLayout(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
