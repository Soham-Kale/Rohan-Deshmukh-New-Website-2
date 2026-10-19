import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyHeroMobilePhotos, removeAppealCta, removeFoundationImpact, removeParivarEmoji } from '../seed/content-updates'
import { stripEmojiEverywhere } from '../seed/strip-emoji'

/** Content migration: removes the closing "आम्हाला साथ द्या" band from every page, every emoji from the website content (both languages), the Impact / road-ahead blocks from the Lokmangal Foundation page, and sets phone photos for the first two home slides */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await removeAppealCta(payload)
  await removeParivarEmoji(payload)
  await stripEmojiEverywhere(payload)
  await removeFoundationImpact(payload)
  await applyHeroMobilePhotos(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
