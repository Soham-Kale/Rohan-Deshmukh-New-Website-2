import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyPhotoGallery } from '../seed/photo-gallery'

/** Content migration: Photo Gallery albums trimmed to photos with Rohan Deshmukh (30 per album), faces kept in view */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyPhotoGallery(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
