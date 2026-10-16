import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyPhotoGallery } from '../seed/photo-gallery'

/** Content migration: Photo Gallery → Family / Celebrity / Political Moments (photos from instagram.com/rohan1942); old albums removed */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyPhotoGallery(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
