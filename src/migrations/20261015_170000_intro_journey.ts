import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyIntroJourney } from '../seed/content-updates'

/** Content migration: स्वपरिचय page content for the journey-map layout */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyIntroJourney(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
