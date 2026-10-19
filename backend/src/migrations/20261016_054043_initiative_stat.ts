import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_initiatives_category";
  CREATE TYPE "public"."enum_initiatives_category" AS ENUM('food', 'agriculture', 'education', 'health', 'community', 'women', 'culture', 'senior-citizens', 'youth');
  ALTER TABLE "initiatives" ALTER COLUMN "category" SET DATA TYPE "public"."enum_initiatives_category" USING "category"::"public"."enum_initiatives_category";
  ALTER TABLE "_initiatives_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE "public"."enum__initiatives_v_version_category";
  CREATE TYPE "public"."enum__initiatives_v_version_category" AS ENUM('food', 'agriculture', 'education', 'health', 'community', 'women', 'culture', 'senior-citizens', 'youth');
  ALTER TABLE "_initiatives_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__initiatives_v_version_category" USING "version_category"::"public"."enum__initiatives_v_version_category";
  ALTER TABLE "initiatives_locales" ADD COLUMN "stat" varchar;
  ALTER TABLE "_initiatives_v_locales" ADD COLUMN "version_stat" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "initiatives" ALTER COLUMN "category" SET DATA TYPE text;
  DROP TYPE "public"."enum_initiatives_category";
  CREATE TYPE "public"."enum_initiatives_category" AS ENUM('health', 'senior-citizens', 'education', 'women', 'agriculture', 'youth', 'culture', 'community');
  ALTER TABLE "initiatives" ALTER COLUMN "category" SET DATA TYPE "public"."enum_initiatives_category" USING "category"::"public"."enum_initiatives_category";
  ALTER TABLE "_initiatives_v" ALTER COLUMN "version_category" SET DATA TYPE text;
  DROP TYPE "public"."enum__initiatives_v_version_category";
  CREATE TYPE "public"."enum__initiatives_v_version_category" AS ENUM('health', 'senior-citizens', 'education', 'women', 'agriculture', 'youth', 'culture', 'community');
  ALTER TABLE "_initiatives_v" ALTER COLUMN "version_category" SET DATA TYPE "public"."enum__initiatives_v_version_category" USING "version_category"::"public"."enum__initiatives_v_version_category";
  ALTER TABLE "initiatives_locales" DROP COLUMN "stat";
  ALTER TABLE "_initiatives_v_locales" DROP COLUMN "version_stat";`)
}
