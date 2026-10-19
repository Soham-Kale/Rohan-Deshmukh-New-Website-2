import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_events_group" AS ENUM('youth', 'sports');
  CREATE TABLE "events_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "events_facts_locales" (
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "events" ADD COLUMN "group" "enum_events_group";
  ALTER TABLE "events_locales" ADD COLUMN "tagline" varchar;
  ALTER TABLE "events_locales" ADD COLUMN "body" varchar;
  ALTER TABLE "events_facts" ADD CONSTRAINT "events_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_facts_locales" ADD CONSTRAINT "events_facts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_facts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "events_facts_order_idx" ON "events_facts" USING btree ("_order");
  CREATE INDEX "events_facts_parent_id_idx" ON "events_facts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_facts_locales_locale_parent_id_unique" ON "events_facts_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "events_facts" CASCADE;
  DROP TABLE "events_facts_locales" CASCADE;
  ALTER TABLE "events" DROP COLUMN "group";
  ALTER TABLE "events_locales" DROP COLUMN "tagline";
  ALTER TABLE "events_locales" DROP COLUMN "body";
  DROP TYPE "public"."enum_events_group";`)
}
