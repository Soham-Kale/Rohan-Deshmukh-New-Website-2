import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero_slider" ALTER COLUMN "autoplay_seconds" SET DEFAULT 5;
  ALTER TABLE "_home_v_blocks_hero_slider" ALTER COLUMN "autoplay_seconds" SET DEFAULT 5;
  ALTER TABLE "home_blocks_hero_slider_slides_locales" ADD COLUMN "kicker" varchar;
  ALTER TABLE "_home_v_blocks_hero_slider_slides_locales" ADD COLUMN "kicker" varchar;`)

  // Fill the new small line for the slides that came with the site (matched by heading, so edited slides are left alone)
  for (const table of ['home_blocks_hero_slider_slides_locales', '_home_v_blocks_hero_slider_slides_locales']) {
    await db.execute(sql.raw(`
    UPDATE "${table}" SET "kicker" = CASE "heading"
      WHEN 'मी रोहन सुभाष देशमुख' THEN 'अध्यक्ष, लोकमंगल फाऊंडेशन'
      WHEN 'I am Rohan Subhash Deshmukh' THEN 'Chairman, Lokmangal Foundation'
      WHEN 'समाजात बदल घडवण्यासाठी केलेला छोटासा प्रयत्नही खूप मोठा असतो' THEN 'लोकमंगल फाऊंडेशन'
      WHEN 'Even a small effort to change society is a big one' THEN 'Lokmangal Foundation'
      WHEN 'संयम, सातत्य आणि परिश्रम' THEN 'शिक्षण · आरोग्य · पाणी · रोजगार'
      WHEN 'Patience, consistency and hard work' THEN 'Education · Health · Water · Jobs'
      WHEN 'उत्तम शासकाचा जन्म हा तळागाळातल्या जनतेच्या समस्या आणि गरजा जाणून होतो' THEN 'रोहन सुभाष देशमुख'
      WHEN 'A good leader is born by understanding the needs of people at the grassroots' THEN 'Rohan Subhash Deshmukh'
    END
    WHERE "kicker" IS NULL AND "heading" IN ('मी रोहन सुभाष देशमुख', 'I am Rohan Subhash Deshmukh', 'समाजात बदल घडवण्यासाठी केलेला छोटासा प्रयत्नही खूप मोठा असतो', 'Even a small effort to change society is a big one', 'संयम, सातत्य आणि परिश्रम', 'Patience, consistency and hard work', 'उत्तम शासकाचा जन्म हा तळागाळातल्या जनतेच्या समस्या आणि गरजा जाणून होतो', 'A good leader is born by understanding the needs of people at the grassroots')`))
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_blocks_hero_slider" ALTER COLUMN "autoplay_seconds" SET DEFAULT 6;
  ALTER TABLE "_home_v_blocks_hero_slider" ALTER COLUMN "autoplay_seconds" SET DEFAULT 6;
  ALTER TABLE "home_blocks_hero_slider_slides_locales" DROP COLUMN "kicker";
  ALTER TABLE "_home_v_blocks_hero_slider_slides_locales" DROP COLUMN "kicker";`)
}
