import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyContentUpdates } from '../seed/content-updates'

/**
 * Content migration (no schema change): Thoughts page removed from the menu/footer,
 * "जीवनचरित्र / Biography" renamed to "कौटुंबिक पार्श्वभूमी / Family Background",
 * Terms page no longer mentions the removed "Download Official Photos" section.
 * Skipped on an empty database (the seed already has the new content).
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'pages' })
  if (!totalDocs) return
  await applyContentUpdates(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // content is not restored automatically; edit it in the admin if needed
}
