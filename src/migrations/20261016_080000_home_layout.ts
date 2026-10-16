import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyHomeLayout } from '../seed/home-layout'

/** Content migration: new homepage sections after the hero slider (the slider itself is kept as it is) */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyHomeLayout(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
