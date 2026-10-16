import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyHomeLayout } from '../seed/home-layout'
import { removeKeyAreaIcons } from '../seed/content-updates'

/**
 * Content migration: homepage without the "देशमुख परिवार" heading and without the fact tags under the intro
 * (hero slider untouched); Lokmangal Foundation "Key Areas of Work" cards without emoji icons.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyHomeLayout(payload)
  await removeKeyAreaIcons(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
