import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyLokmangalMenuAndIntro } from '../seed/content-updates'

/** Content migration: लोकमंगल menu (फाऊंडेशन · कार्यक्रम · प्रकल्प) and the homepage परिचय without the counters */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyLokmangalMenuAndIntro(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
