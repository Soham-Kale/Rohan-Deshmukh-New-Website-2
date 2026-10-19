import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyAboutMenu } from '../seed/content-updates'

/**
 * Content migration (no schema change): new header menu
 * (परिचय: स्वपरिचय · कौटुंबिक पार्श्वभूमी · लोकमंगल परिवार · राजकीय कारकीर्द / लोकमंगल → लोकमंगल फाऊंडेशन /
 * मीडिया / संपर्क) and the new स्वपरिचय page. Skipped on an empty database (the seed has it).
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const { totalDocs } = await payload.count({ collection: 'pages' })
  if (!totalDocs) return
  await applyAboutMenu(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // menu and page are not removed automatically; edit them in the admin if needed
}
