import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyMenu } from '../seed/menu'

/**
 * Content migration (no schema change): new menu — About / Lokmangal / Events / Gallery / Connect —
 * footer links without the removed pages, and #ConnectWithRohan → Contact.
 * Skipped on an empty database (the seed writes the new menu itself).
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'pages' })
  if (!totalDocs) return
  await applyMenu(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // menu content is not restored automatically; edit it under Settings → Menu if needed
}
