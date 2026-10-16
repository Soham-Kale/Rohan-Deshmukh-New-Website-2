import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_blocks_home_journey_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_journey_items_locales" (
  	"place" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_journey_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_initiatives_showcase_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_initiatives_showcase_stats_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_parivar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_parivar_items_locales" (
  	"value" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_parivar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_parivar_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "home_blocks_home_highlights_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_highlights_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"limit" numeric DEFAULT 4,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_events_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_vision" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_vision_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_journey_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_journey_items_locales" (
  	"place" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_journey" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_journey_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_initiatives_showcase_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_initiatives_showcase_stats_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_parivar_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_parivar_items_locales" (
  	"value" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_parivar" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_parivar_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_highlights_items_locales" (
  	"tag" varchar,
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_highlights_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"limit" numeric DEFAULT 4,
  	"button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_events_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_vision" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_vision_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "home_blocks_initiatives_showcase" ADD COLUMN "button_url" varchar;
  ALTER TABLE "home_blocks_initiatives_showcase_locales" ADD COLUMN "button_label" varchar;
  ALTER TABLE "home_blocks_family" ADD COLUMN "button_url" varchar;
  ALTER TABLE "home_blocks_family_locales" ADD COLUMN "intro" varchar;
  ALTER TABLE "home_blocks_family_locales" ADD COLUMN "button_label" varchar;
  ALTER TABLE "home_blocks_home_gallery" ADD COLUMN "button_url" varchar;
  ALTER TABLE "home_blocks_home_gallery_locales" ADD COLUMN "button_label" varchar;
  ALTER TABLE "home_blocks_appeal_band" ADD COLUMN "show_whatsapp" boolean DEFAULT true;
  ALTER TABLE "home_blocks_appeal_band_locales" ADD COLUMN "text" varchar;
  ALTER TABLE "_home_v_blocks_initiatives_showcase" ADD COLUMN "button_url" varchar;
  ALTER TABLE "_home_v_blocks_initiatives_showcase_locales" ADD COLUMN "button_label" varchar;
  ALTER TABLE "_home_v_blocks_family" ADD COLUMN "button_url" varchar;
  ALTER TABLE "_home_v_blocks_family_locales" ADD COLUMN "intro" varchar;
  ALTER TABLE "_home_v_blocks_family_locales" ADD COLUMN "button_label" varchar;
  ALTER TABLE "_home_v_blocks_home_gallery" ADD COLUMN "button_url" varchar;
  ALTER TABLE "_home_v_blocks_home_gallery_locales" ADD COLUMN "button_label" varchar;
  ALTER TABLE "_home_v_blocks_appeal_band" ADD COLUMN "show_whatsapp" boolean DEFAULT true;
  ALTER TABLE "_home_v_blocks_appeal_band_locales" ADD COLUMN "text" varchar;
  ALTER TABLE "home_blocks_home_journey_items" ADD CONSTRAINT "home_blocks_home_journey_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_journey_items_locales" ADD CONSTRAINT "home_blocks_home_journey_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_journey_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_journey" ADD CONSTRAINT "home_blocks_home_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_journey_locales" ADD CONSTRAINT "home_blocks_home_journey_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_initiatives_showcase_stats" ADD CONSTRAINT "home_blocks_initiatives_showcase_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_initiatives_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_initiatives_showcase_stats_locales" ADD CONSTRAINT "home_blocks_initiatives_showcase_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_initiatives_showcase_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_parivar_items" ADD CONSTRAINT "home_blocks_home_parivar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_parivar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_parivar_items_locales" ADD CONSTRAINT "home_blocks_home_parivar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_parivar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_parivar" ADD CONSTRAINT "home_blocks_home_parivar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_parivar_locales" ADD CONSTRAINT "home_blocks_home_parivar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_parivar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_highlights_items" ADD CONSTRAINT "home_blocks_home_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_highlights_items_locales" ADD CONSTRAINT "home_blocks_home_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_highlights" ADD CONSTRAINT "home_blocks_home_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_highlights_locales" ADD CONSTRAINT "home_blocks_home_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_events" ADD CONSTRAINT "home_blocks_home_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_events_locales" ADD CONSTRAINT "home_blocks_home_events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_vision" ADD CONSTRAINT "home_blocks_home_vision_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_home_vision" ADD CONSTRAINT "home_blocks_home_vision_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_vision_locales" ADD CONSTRAINT "home_blocks_home_vision_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_vision"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_journey_items" ADD CONSTRAINT "_home_v_blocks_home_journey_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_journey_items_locales" ADD CONSTRAINT "_home_v_blocks_home_journey_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_journey_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_journey" ADD CONSTRAINT "_home_v_blocks_home_journey_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_journey_locales" ADD CONSTRAINT "_home_v_blocks_home_journey_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_initiatives_showcase_stats" ADD CONSTRAINT "_home_v_blocks_initiatives_showcase_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_initiatives_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_initiatives_showcase_stats_locales" ADD CONSTRAINT "_home_v_blocks_initiatives_showcase_stats_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_initiatives_showcase_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_parivar_items" ADD CONSTRAINT "_home_v_blocks_home_parivar_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_parivar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_parivar_items_locales" ADD CONSTRAINT "_home_v_blocks_home_parivar_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_parivar_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_parivar" ADD CONSTRAINT "_home_v_blocks_home_parivar_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_parivar_locales" ADD CONSTRAINT "_home_v_blocks_home_parivar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_parivar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_highlights_items" ADD CONSTRAINT "_home_v_blocks_home_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_highlights_items_locales" ADD CONSTRAINT "_home_v_blocks_home_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_highlights" ADD CONSTRAINT "_home_v_blocks_home_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_highlights_locales" ADD CONSTRAINT "_home_v_blocks_home_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_events" ADD CONSTRAINT "_home_v_blocks_home_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_events_locales" ADD CONSTRAINT "_home_v_blocks_home_events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_vision" ADD CONSTRAINT "_home_v_blocks_home_vision_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_vision" ADD CONSTRAINT "_home_v_blocks_home_vision_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_vision_locales" ADD CONSTRAINT "_home_v_blocks_home_vision_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_vision"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_home_journey_items_order_idx" ON "home_blocks_home_journey_items" USING btree ("_order");
  CREATE INDEX "home_blocks_home_journey_items_parent_id_idx" ON "home_blocks_home_journey_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_home_journey_items_locales_locale_parent_id_uniq" ON "home_blocks_home_journey_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_journey_order_idx" ON "home_blocks_home_journey" USING btree ("_order");
  CREATE INDEX "home_blocks_home_journey_parent_id_idx" ON "home_blocks_home_journey" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_journey_path_idx" ON "home_blocks_home_journey" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_home_journey_locales_locale_parent_id_unique" ON "home_blocks_home_journey_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_initiatives_showcase_stats_order_idx" ON "home_blocks_initiatives_showcase_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_initiatives_showcase_stats_parent_id_idx" ON "home_blocks_initiatives_showcase_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_initiatives_showcase_stats_locales_locale_parent" ON "home_blocks_initiatives_showcase_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_parivar_items_order_idx" ON "home_blocks_home_parivar_items" USING btree ("_order");
  CREATE INDEX "home_blocks_home_parivar_items_parent_id_idx" ON "home_blocks_home_parivar_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_home_parivar_items_locales_locale_parent_id_uniq" ON "home_blocks_home_parivar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_parivar_order_idx" ON "home_blocks_home_parivar" USING btree ("_order");
  CREATE INDEX "home_blocks_home_parivar_parent_id_idx" ON "home_blocks_home_parivar" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_parivar_path_idx" ON "home_blocks_home_parivar" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_home_parivar_locales_locale_parent_id_unique" ON "home_blocks_home_parivar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_highlights_items_order_idx" ON "home_blocks_home_highlights_items" USING btree ("_order");
  CREATE INDEX "home_blocks_home_highlights_items_parent_id_idx" ON "home_blocks_home_highlights_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_home_highlights_items_locales_locale_parent_id_u" ON "home_blocks_home_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_highlights_order_idx" ON "home_blocks_home_highlights" USING btree ("_order");
  CREATE INDEX "home_blocks_home_highlights_parent_id_idx" ON "home_blocks_home_highlights" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_highlights_path_idx" ON "home_blocks_home_highlights" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_home_highlights_locales_locale_parent_id_unique" ON "home_blocks_home_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_events_order_idx" ON "home_blocks_home_events" USING btree ("_order");
  CREATE INDEX "home_blocks_home_events_parent_id_idx" ON "home_blocks_home_events" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_events_path_idx" ON "home_blocks_home_events" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_home_events_locales_locale_parent_id_unique" ON "home_blocks_home_events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_vision_order_idx" ON "home_blocks_home_vision" USING btree ("_order");
  CREATE INDEX "home_blocks_home_vision_parent_id_idx" ON "home_blocks_home_vision" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_vision_path_idx" ON "home_blocks_home_vision" USING btree ("_path");
  CREATE INDEX "home_blocks_home_vision_image_idx" ON "home_blocks_home_vision" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_home_vision_locales_locale_parent_id_unique" ON "home_blocks_home_vision_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_journey_items_order_idx" ON "_home_v_blocks_home_journey_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_journey_items_parent_id_idx" ON "_home_v_blocks_home_journey_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_journey_items_locales_locale_parent_id_u" ON "_home_v_blocks_home_journey_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_journey_order_idx" ON "_home_v_blocks_home_journey" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_journey_parent_id_idx" ON "_home_v_blocks_home_journey" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_journey_path_idx" ON "_home_v_blocks_home_journey" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_home_journey_locales_locale_parent_id_unique" ON "_home_v_blocks_home_journey_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_initiatives_showcase_stats_order_idx" ON "_home_v_blocks_initiatives_showcase_stats" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_initiatives_showcase_stats_parent_id_idx" ON "_home_v_blocks_initiatives_showcase_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_initiatives_showcase_stats_locales_locale_par" ON "_home_v_blocks_initiatives_showcase_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_parivar_items_order_idx" ON "_home_v_blocks_home_parivar_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_parivar_items_parent_id_idx" ON "_home_v_blocks_home_parivar_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_parivar_items_locales_locale_parent_id_u" ON "_home_v_blocks_home_parivar_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_parivar_order_idx" ON "_home_v_blocks_home_parivar" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_parivar_parent_id_idx" ON "_home_v_blocks_home_parivar" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_parivar_path_idx" ON "_home_v_blocks_home_parivar" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_home_parivar_locales_locale_parent_id_unique" ON "_home_v_blocks_home_parivar_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_highlights_items_order_idx" ON "_home_v_blocks_home_highlights_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_highlights_items_parent_id_idx" ON "_home_v_blocks_home_highlights_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_highlights_items_locales_locale_parent_i" ON "_home_v_blocks_home_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_highlights_order_idx" ON "_home_v_blocks_home_highlights" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_highlights_parent_id_idx" ON "_home_v_blocks_home_highlights" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_highlights_path_idx" ON "_home_v_blocks_home_highlights" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_home_highlights_locales_locale_parent_id_uniq" ON "_home_v_blocks_home_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_events_order_idx" ON "_home_v_blocks_home_events" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_events_parent_id_idx" ON "_home_v_blocks_home_events" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_events_path_idx" ON "_home_v_blocks_home_events" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_home_events_locales_locale_parent_id_unique" ON "_home_v_blocks_home_events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_vision_order_idx" ON "_home_v_blocks_home_vision" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_vision_parent_id_idx" ON "_home_v_blocks_home_vision" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_vision_path_idx" ON "_home_v_blocks_home_vision" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_home_vision_image_idx" ON "_home_v_blocks_home_vision" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_vision_locales_locale_parent_id_unique" ON "_home_v_blocks_home_vision_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_blocks_home_journey_items" CASCADE;
  DROP TABLE "home_blocks_home_journey_items_locales" CASCADE;
  DROP TABLE "home_blocks_home_journey" CASCADE;
  DROP TABLE "home_blocks_home_journey_locales" CASCADE;
  DROP TABLE "home_blocks_initiatives_showcase_stats" CASCADE;
  DROP TABLE "home_blocks_initiatives_showcase_stats_locales" CASCADE;
  DROP TABLE "home_blocks_home_parivar_items" CASCADE;
  DROP TABLE "home_blocks_home_parivar_items_locales" CASCADE;
  DROP TABLE "home_blocks_home_parivar" CASCADE;
  DROP TABLE "home_blocks_home_parivar_locales" CASCADE;
  DROP TABLE "home_blocks_home_highlights_items" CASCADE;
  DROP TABLE "home_blocks_home_highlights_items_locales" CASCADE;
  DROP TABLE "home_blocks_home_highlights" CASCADE;
  DROP TABLE "home_blocks_home_highlights_locales" CASCADE;
  DROP TABLE "home_blocks_home_events" CASCADE;
  DROP TABLE "home_blocks_home_events_locales" CASCADE;
  DROP TABLE "home_blocks_home_vision" CASCADE;
  DROP TABLE "home_blocks_home_vision_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_journey_items" CASCADE;
  DROP TABLE "_home_v_blocks_home_journey_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_journey" CASCADE;
  DROP TABLE "_home_v_blocks_home_journey_locales" CASCADE;
  DROP TABLE "_home_v_blocks_initiatives_showcase_stats" CASCADE;
  DROP TABLE "_home_v_blocks_initiatives_showcase_stats_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_parivar_items" CASCADE;
  DROP TABLE "_home_v_blocks_home_parivar_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_parivar" CASCADE;
  DROP TABLE "_home_v_blocks_home_parivar_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_highlights_items" CASCADE;
  DROP TABLE "_home_v_blocks_home_highlights_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_highlights" CASCADE;
  DROP TABLE "_home_v_blocks_home_highlights_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_events" CASCADE;
  DROP TABLE "_home_v_blocks_home_events_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_vision" CASCADE;
  DROP TABLE "_home_v_blocks_home_vision_locales" CASCADE;
  ALTER TABLE "home_blocks_initiatives_showcase" DROP COLUMN "button_url";
  ALTER TABLE "home_blocks_initiatives_showcase_locales" DROP COLUMN "button_label";
  ALTER TABLE "home_blocks_family" DROP COLUMN "button_url";
  ALTER TABLE "home_blocks_family_locales" DROP COLUMN "intro";
  ALTER TABLE "home_blocks_family_locales" DROP COLUMN "button_label";
  ALTER TABLE "home_blocks_home_gallery" DROP COLUMN "button_url";
  ALTER TABLE "home_blocks_home_gallery_locales" DROP COLUMN "button_label";
  ALTER TABLE "home_blocks_appeal_band" DROP COLUMN "show_whatsapp";
  ALTER TABLE "home_blocks_appeal_band_locales" DROP COLUMN "text";
  ALTER TABLE "_home_v_blocks_initiatives_showcase" DROP COLUMN "button_url";
  ALTER TABLE "_home_v_blocks_initiatives_showcase_locales" DROP COLUMN "button_label";
  ALTER TABLE "_home_v_blocks_family" DROP COLUMN "button_url";
  ALTER TABLE "_home_v_blocks_family_locales" DROP COLUMN "intro";
  ALTER TABLE "_home_v_blocks_family_locales" DROP COLUMN "button_label";
  ALTER TABLE "_home_v_blocks_home_gallery" DROP COLUMN "button_url";
  ALTER TABLE "_home_v_blocks_home_gallery_locales" DROP COLUMN "button_label";
  ALTER TABLE "_home_v_blocks_appeal_band" DROP COLUMN "show_whatsapp";
  ALTER TABLE "_home_v_blocks_appeal_band_locales" DROP COLUMN "text";`)
}
