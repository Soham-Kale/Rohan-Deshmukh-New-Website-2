/**
 * Adds an optional photo to each सामाजिक उपक्रम card on the homepage.
 * (Old, unused site-settings columns are deliberately left in place — nothing is dropped.)
 */
import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_home_highlights_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "_home_v_blocks_home_highlights_items" ADD COLUMN "image_id" integer;
  ALTER TABLE "home_blocks_home_highlights_items" ADD CONSTRAINT "home_blocks_home_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_highlights_items" ADD CONSTRAINT "_home_v_blocks_home_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_blocks_home_highlights_items_image_idx" ON "home_blocks_home_highlights_items" USING btree ("image_id");
  CREATE INDEX "_home_v_blocks_home_highlights_items_image_idx" ON "_home_v_blocks_home_highlights_items" USING btree ("image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_home_highlights_items" DROP CONSTRAINT "home_blocks_home_highlights_items_image_id_media_id_fk";
  
  ALTER TABLE "_home_v_blocks_home_highlights_items" DROP CONSTRAINT "_home_v_blocks_home_highlights_items_image_id_media_id_fk";
  
  DROP INDEX "home_blocks_home_highlights_items_image_idx";
  DROP INDEX "_home_v_blocks_home_highlights_items_image_idx";
  ALTER TABLE "home_blocks_home_highlights_items" DROP COLUMN "image_id";
  ALTER TABLE "_home_v_blocks_home_highlights_items" DROP COLUMN "image_id";`)
}
