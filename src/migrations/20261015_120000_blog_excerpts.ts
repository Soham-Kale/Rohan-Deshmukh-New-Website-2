import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyBlogExcerpts } from '../seed/content-updates'

/** Content migration: English summaries for the blog posts (the English site showed the Marathi summary) */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyBlogExcerpts(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
