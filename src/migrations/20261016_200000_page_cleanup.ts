import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { removeAppealCta, removeFoundationImpact, removeParivarEmoji } from '../seed/content-updates'
import { stripEmojiEverywhere } from '../seed/strip-emoji'

/** Content migration: removes the closing "आम्हाला साथ द्या" band from every page, every emoji from the website content (both languages), and the Impact / road-ahead blocks from the Lokmangal Foundation page */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await removeAppealCta(payload)
  await removeParivarEmoji(payload)
  await stripEmojiEverywhere(payload)
  await removeFoundationImpact(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
