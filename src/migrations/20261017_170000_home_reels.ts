import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyHomeLayout } from '../seed/home-layout'

/** Content migration (17 Oct 2026): adds the Instagram reels section under the homepage video (and the photos on the सामाजिक उपक्रम cards) */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyHomeLayout(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
