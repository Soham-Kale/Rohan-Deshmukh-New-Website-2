import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "initiatives_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "initiatives_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_initiatives_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_version_videos_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "initiatives_locales" ADD COLUMN "objective" varchar;
  ALTER TABLE "_initiatives_v_locales" ADD COLUMN "version_objective" varchar;
  ALTER TABLE "initiatives_videos" ADD CONSTRAINT "initiatives_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_videos_locales" ADD CONSTRAINT "initiatives_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives_videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_videos" ADD CONSTRAINT "_initiatives_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_videos_locales" ADD CONSTRAINT "_initiatives_v_version_videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v_version_videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "initiatives_videos_order_idx" ON "initiatives_videos" USING btree ("_order");
  CREATE INDEX "initiatives_videos_parent_id_idx" ON "initiatives_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "initiatives_videos_locales_locale_parent_id_unique" ON "initiatives_videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_initiatives_v_version_videos_order_idx" ON "_initiatives_v_version_videos" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_videos_parent_id_idx" ON "_initiatives_v_version_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_initiatives_v_version_videos_locales_locale_parent_id_uniqu" ON "_initiatives_v_version_videos_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "initiatives_videos" CASCADE;
  DROP TABLE "initiatives_videos_locales" CASCADE;
  DROP TABLE "_initiatives_v_version_videos" CASCADE;
  DROP TABLE "_initiatives_v_version_videos_locales" CASCADE;
  ALTER TABLE "initiatives_locales" DROP COLUMN "objective";
  ALTER TABLE "_initiatives_v_locales" DROP COLUMN "version_objective";`)
}
