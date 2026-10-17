import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyHomeLayout } from '../seed/home-layout'

/**
 * Content migration (17 Oct 2026): the homepage keeps only Intro → Journey → सामाजिक उपक्रम (was राजकीय प्रवास) →
 * Vision → Lokmangal Parivar → Video ("Milk Adulteration in India"). The hero slider is left exactly as it is.
 */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyHomeLayout(payload)
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
