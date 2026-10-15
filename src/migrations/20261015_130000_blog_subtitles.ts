import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { clearEnglishSubtitles } from '../seed/content-updates'

/** Content migration: remove the English subtitle shown under the Marathi blog titles */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await clearEnglishSubtitles(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
