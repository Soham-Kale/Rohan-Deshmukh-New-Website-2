import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyDocContent } from '../seed/content-updates'

/**
 * Content migration: text from the client document "New Content RD Web" (homepage परिचय, स्वपरिचय,
 * कौटुंबिक पार्श्वभूमी, लोकमंगल परिवार, राजकीय कारकीर्द, लोकमंगल फाऊंडेशन) and the four Foundation events.
 * Skipped on an empty database (the seed already has it).
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'pages' })
  if (!totalDocs) return
  await applyDocContent(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // previous page text is kept in each page's version history in the admin
}
