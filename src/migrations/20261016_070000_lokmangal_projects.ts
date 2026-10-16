import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyLokmangalProjects } from '../seed/content-updates'

/** Content migration: the 23 Lokmangal Foundation initiatives (lokmangalfoundation.com/projects), Marathi + English */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyLokmangalProjects(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
