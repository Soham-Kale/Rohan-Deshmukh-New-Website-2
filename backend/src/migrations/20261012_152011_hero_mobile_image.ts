import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero_slider_slides" ADD COLUMN "image_mobile_id" integer;
  ALTER TABLE "_home_v_blocks_hero_slider_slides" ADD COLUMN "image_mobile_id" integer;
  ALTER TABLE "home_blocks_hero_slider_slides" ADD CONSTRAINT "home_blocks_hero_slider_slides_image_mobile_id_media_id_fk" FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_slides" ADD CONSTRAINT "_home_v_blocks_hero_slider_slides_image_mobile_id_media_id_fk" FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_blocks_hero_slider_slides_image_mobile_idx" ON "home_blocks_hero_slider_slides" USING btree ("image_mobile_id");
  CREATE INDEX "_home_v_blocks_hero_slider_slides_image_mobile_idx" ON "_home_v_blocks_hero_slider_slides" USING btree ("image_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero_slider_slides" DROP CONSTRAINT "home_blocks_hero_slider_slides_image_mobile_id_media_id_fk";
  
  ALTER TABLE "_home_v_blocks_hero_slider_slides" DROP CONSTRAINT "_home_v_blocks_hero_slider_slides_image_mobile_id_media_id_fk";
  
  DROP INDEX "home_blocks_hero_slider_slides_image_mobile_idx";
  DROP INDEX "_home_v_blocks_hero_slider_slides_image_mobile_idx";
  ALTER TABLE "home_blocks_hero_slider_slides" DROP COLUMN "image_mobile_id";
  ALTER TABLE "_home_v_blocks_hero_slider_slides" DROP COLUMN "image_mobile_id";`)
}
