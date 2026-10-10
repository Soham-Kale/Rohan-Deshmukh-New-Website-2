import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('mr', 'en');
  CREATE TYPE "public"."enum_pages_blocks_media_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_gallery_layout" AS ENUM('grid', 'masonry');
  CREATE TYPE "public"."enum_pages_section" AS ENUM('about', 'lokmangal', 'constituency', 'political', 'vision', 'engage', 'legal', 'other');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_media_text_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_cards_columns" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_layout" AS ENUM('grid', 'masonry');
  CREATE TYPE "public"."enum__pages_v_version_section" AS ENUM('about', 'lokmangal', 'constituency', 'political', 'vision', 'engage', 'legal', 'other');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('mr', 'en');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('mr', 'en');
  CREATE TYPE "public"."enum_initiatives_category" AS ENUM('health', 'senior-citizens', 'education', 'women', 'agriculture', 'youth', 'culture', 'community');
  CREATE TYPE "public"."enum_initiatives_organisation" AS ENUM('foundation', 'parivar', 'vishwamangal');
  CREATE TYPE "public"."enum_initiatives_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__initiatives_v_version_category" AS ENUM('health', 'senior-citizens', 'education', 'women', 'agriculture', 'youth', 'culture', 'community');
  CREATE TYPE "public"."enum__initiatives_v_version_organisation" AS ENUM('foundation', 'parivar', 'vishwamangal');
  CREATE TYPE "public"."enum__initiatives_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__initiatives_v_published_locale" AS ENUM('mr', 'en');
  CREATE TYPE "public"."enum_albums_category" AS ENUM('events', 'social', 'political', 'public');
  CREATE TYPE "public"."enum_quotes_category" AS ENUM('inspiration', 'service', 'new-india', 'entrepreneurship', 'youth');
  CREATE TYPE "public"."enum_leader_meetings_level" AS ENUM('national', 'state', 'other');
  CREATE TYPE "public"."enum_jobs_type" AS ENUM('full-time', 'part-time', 'internship', 'volunteer');
  CREATE TYPE "public"."enum_contact_messages_status" AS ENUM('new', 'in-progress', 'resolved', 'spam');
  CREATE TYPE "public"."enum_grievances_type" AS ENUM('grievance', 'suggestion');
  CREATE TYPE "public"."enum_grievances_status" AS ENUM('new', 'in-progress', 'resolved', 'spam');
  CREATE TYPE "public"."enum_job_applications_status" AS ENUM('new', 'in-progress', 'resolved', 'spam');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'editor', 'media-uploader');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_locale" AS ENUM('all', 'mr', 'en');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_home_blocks_quick_links_items_icon" AS ENUM('user', 'heart', 'book', 'camera', 'video', 'vote', 'pen', 'phone', 'info', 'flag', 'leaf', 'award');
  CREATE TYPE "public"."enum_home_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_blocks_quick_links_items_icon" AS ENUM('user', 'heart', 'book', 'camera', 'video', 'vote', 'pen', 'phone', 'info', 'flag', 'leaf', 'award');
  CREATE TYPE "public"."enum__home_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_v_published_locale" AS ENUM('mr', 'en');
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_text_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_media_text_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_media_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_media_text_image_position" DEFAULT 'left',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_media_text_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats_items_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_items_locales" (
  	"title" varchar,
  	"meta" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"columns" "enum_pages_blocks_cards_columns" DEFAULT '3',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cards_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"layout" "enum_pages_blocks_gallery_layout" DEFAULT 'grid',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"youtube_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_video_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_downloads_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "pages_blocks_downloads_files_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_downloads_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_cta_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"path" varchar,
  	"section" "enum_pages_section" DEFAULT 'other',
  	"menu_order" numeric DEFAULT 10,
  	"show_side_menu" boolean DEFAULT true,
  	"banner_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_content_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_text_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_text_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_media_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_media_text_image_position" DEFAULT 'left',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_media_text_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cards_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards_items_locales" (
  	"title" varchar,
  	"meta" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"columns" "enum__pages_v_blocks_cards_columns" DEFAULT '3',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cards_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"layout" "enum__pages_v_blocks_gallery_layout" DEFAULT 'grid',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_faq_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"youtube_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_quote_locales" (
  	"text" varchar,
  	"author" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_downloads_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads_files_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_path" varchar,
  	"version_section" "enum__pages_v_version_section" DEFAULT 'other',
  	"version_menu_order" numeric DEFAULT 10,
  	"version_show_side_menu" boolean DEFAULT true,
  	"version_banner_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"author" varchar DEFAULT 'रोहन देशमुख',
  	"excerpt" varchar,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_cover_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_author" varchar DEFAULT 'रोहन देशमुख',
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "initiatives_counters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "initiatives_counters_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "initiatives" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_initiatives_category",
  	"organisation" "enum_initiatives_organisation" DEFAULT 'foundation',
  	"featured" boolean DEFAULT false,
  	"order" numeric DEFAULT 10,
  	"hero_image_id" integer,
  	"youtube_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_initiatives_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "initiatives_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "initiatives_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "_initiatives_v_version_counters" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_initiatives_v_version_counters_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_initiatives_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__initiatives_v_version_category",
  	"version_organisation" "enum__initiatives_v_version_organisation" DEFAULT 'foundation',
  	"version_featured" boolean DEFAULT false,
  	"version_order" numeric DEFAULT 10,
  	"version_hero_image_id" integer,
  	"version_youtube_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__initiatives_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__initiatives_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_initiatives_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_initiatives_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"posts_id" integer
  );
  
  CREATE TABLE "events_editions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric NOT NULL
  );
  
  CREATE TABLE "events_editions_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"initiative_id" integer,
  	"cover_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "albums" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_albums_category" DEFAULT 'events',
  	"date" timestamp(3) with time zone,
  	"cover_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "albums_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "albums_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"youtube_url" varchar NOT NULL,
  	"featured" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "videos_locales" (
  	"title" varchar NOT NULL,
  	"playlist" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "download_photos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "download_photos_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "quotes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"category" "enum_quotes_category" DEFAULT 'inspiration',
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "quotes_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leader_meetings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"level" "enum_leader_meetings_level" DEFAULT 'national',
  	"date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leader_meetings_locales" (
  	"leader_name" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "awards_locales" (
  	"title" varchar NOT NULL,
  	"awarding_body" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_jobs_type" DEFAULT 'full-time',
  	"last_date" timestamp(3) with time zone,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "jobs_locales" (
  	"title" varchar NOT NULL,
  	"location" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"map_embed_url" varchar,
  	"order" numeric DEFAULT 10,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "offices_locales" (
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "offices_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "contact_messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"office_id" integer,
  	"message" varchar,
  	"attachment_id" integer,
  	"status" "enum_contact_messages_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "grievances" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference_no" varchar,
  	"type" "enum_grievances_type" DEFAULT 'grievance',
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"email" varchar,
  	"address" varchar NOT NULL,
  	"issue" varchar NOT NULL,
  	"attachment_id" integer,
  	"status" "enum_grievances_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"job_id" integer,
  	"name" varchar NOT NULL,
  	"mobile" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar,
  	"cv_id" integer,
  	"status" "enum_job_applications_status" DEFAULT 'new',
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "documents_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"priority" numeric,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"initiatives_id" integer
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"locale" "enum_exports_locale" DEFAULT 'all',
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'contact-messages' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar DEFAULT 'contact-messages' NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer,
  	"initiatives_id" integer,
  	"events_id" integer,
  	"albums_id" integer,
  	"videos_id" integer,
  	"download_photos_id" integer,
  	"quotes_id" integer,
  	"leader_meetings_id" integer,
  	"awards_id" integer,
  	"jobs_id" integer,
  	"offices_id" integer,
  	"contact_messages_id" integer,
  	"grievances_id" integer,
  	"job_applications_id" integer,
  	"media_id" integer,
  	"documents_id" integer,
  	"form_uploads_id" integer,
  	"users_id" integer,
  	"search_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_slider_slides_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "home_blocks_hero_slider_slides_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "home_blocks_hero_slider_slides_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_slider_badge" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_slider_badge_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_hero_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_quick_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_home_blocks_quick_links_items_icon" DEFAULT 'info',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "home_blocks_quick_links_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_quick_links_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_about_intro_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_about_intro_stats_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_about_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_about_intro_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"pledge" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_biography_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "home_blocks_biography_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_biography" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_biography_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_featured_video_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "home_blocks_featured_video_links_locales" (
  	"label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_featured_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"youtube_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_featured_video_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_work_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "home_blocks_work_highlights_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_work_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_work_highlights_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_initiatives_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_initiatives_showcase_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_family_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "home_blocks_family_members_locales" (
  	"relation" varchar,
  	"name" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_family" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_family_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_gallery_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_stats_items_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_stats_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_faq_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "home_blocks_home_faq_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_home_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_home_faq_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_latest_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"limit" numeric DEFAULT 3,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_latest_blog_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_social_feeds_instagram_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "home_blocks_social_feeds_instagram_posts_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_social_feeds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"show_facebook" boolean DEFAULT true,
  	"show_youtube" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_social_feeds_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_appeal_band" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_appeal_band_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_home_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"initiatives_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_home_v_blocks_hero_slider_slides_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_hero_slider_slides_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_hero_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_hero_slider_slides_locales" (
  	"heading" varchar,
  	"subheading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_hero_slider_badge" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_hero_slider_badge_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_hero_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"autoplay_seconds" numeric DEFAULT 6,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_quick_links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__home_v_blocks_quick_links_items_icon" DEFAULT 'info',
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_quick_links_items_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_quick_links_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_about_intro_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_about_intro_stats_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_about_intro" (
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
  
  CREATE TABLE "_home_v_blocks_about_intro_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"pledge" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_biography_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_biography_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_biography" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_biography_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_featured_video_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_featured_video_links_locales" (
  	"label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_featured_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"youtube_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_featured_video_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_work_highlights_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_work_highlights_items_locales" (
  	"title" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_work_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_work_highlights_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_initiatives_showcase" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_initiatives_showcase_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_family_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_family_members_locales" (
  	"relation" varchar,
  	"name" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_family" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_family_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_gallery_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_stats_items_locales" (
  	"value" varchar,
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_stats" (
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
  
  CREATE TABLE "_home_v_blocks_home_stats_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_faq_items_locales" (
  	"question" varchar,
  	"answer" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_faq_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_faq_buttons_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_home_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_home_faq_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_latest_blog" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"limit" numeric DEFAULT 3,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_latest_blog_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_social_feeds_instagram_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_v_blocks_social_feeds_instagram_posts_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_social_feeds" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"hidden" boolean DEFAULT false,
  	"show_facebook" boolean DEFAULT true,
  	"show_youtube" boolean DEFAULT true,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_home_v_blocks_social_feeds_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_blocks_appeal_band" (
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
  
  CREATE TABLE "_home_v_blocks_appeal_band_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__home_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__home_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_home_v_locales" (
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"initiatives_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "header_nav_children_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "header_nav_children_sub_items_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "header_nav_children_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "header_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "header" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_legal_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "footer_legal_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"developer_credit" varchar,
  	"developer_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_light_id" integer,
  	"logo_dark_id" integer,
  	"default_share_image_id" integer,
  	"profile_pdf_id" integer,
  	"phone" varchar,
  	"email" varchar,
  	"whatsapp_number" varchar,
  	"social_facebook" varchar,
  	"social_instagram" varchar,
  	"social_twitter" varchar,
  	"social_youtube" varchar,
  	"social_linkedin" varchar,
  	"social_whatsapp_channel" varchar,
  	"social_telegram" varchar,
  	"cta_url" varchar,
  	"connect_tag_label" varchar DEFAULT '#ConnectWithRohan',
  	"connect_tag_url" varchar,
  	"appeal_button_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"site_name" varchar DEFAULT 'रोहन सुभाष देशमुख' NOT NULL,
  	"tagline" varchar,
  	"address" varchar,
  	"cta_label" varchar,
  	"appeal_heading" varchar,
  	"appeal_button_label" varchar,
  	"form_consent_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "popup" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"image_id" integer,
  	"link_url" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"delay_seconds" numeric DEFAULT 2,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "popup_locales" (
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_locales" ADD CONSTRAINT "pages_blocks_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text_buttons" ADD CONSTRAINT "pages_blocks_media_text_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text_buttons_locales" ADD CONSTRAINT "pages_blocks_media_text_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_text_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text" ADD CONSTRAINT "pages_blocks_media_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text" ADD CONSTRAINT "pages_blocks_media_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_media_text_locales" ADD CONSTRAINT "pages_blocks_media_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items_locales" ADD CONSTRAINT "pages_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_locales" ADD CONSTRAINT "pages_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items" ADD CONSTRAINT "pages_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_items_locales" ADD CONSTRAINT "pages_blocks_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards" ADD CONSTRAINT "pages_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cards_locales" ADD CONSTRAINT "pages_blocks_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_locales" ADD CONSTRAINT "pages_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items" ADD CONSTRAINT "pages_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_items_locales" ADD CONSTRAINT "pages_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_locales" ADD CONSTRAINT "pages_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video_locales" ADD CONSTRAINT "pages_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote" ADD CONSTRAINT "pages_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_quote_locales" ADD CONSTRAINT "pages_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_files" ADD CONSTRAINT "pages_blocks_downloads_files_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_files" ADD CONSTRAINT "pages_blocks_downloads_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_files_locales" ADD CONSTRAINT "pages_blocks_downloads_files_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads" ADD CONSTRAINT "pages_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_locales" ADD CONSTRAINT "pages_blocks_downloads_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_buttons" ADD CONSTRAINT "pages_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_buttons_locales" ADD CONSTRAINT "pages_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_locales" ADD CONSTRAINT "pages_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_banner_image_id_media_id_fk" FOREIGN KEY ("banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_texts" ADD CONSTRAINT "pages_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content" ADD CONSTRAINT "_pages_v_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_content_locales" ADD CONSTRAINT "_pages_v_blocks_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text_buttons" ADD CONSTRAINT "_pages_v_blocks_media_text_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text_buttons_locales" ADD CONSTRAINT "_pages_v_blocks_media_text_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_text_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text" ADD CONSTRAINT "_pages_v_blocks_media_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text" ADD CONSTRAINT "_pages_v_blocks_media_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_media_text_locales" ADD CONSTRAINT "_pages_v_blocks_media_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_media_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items_locales" ADD CONSTRAINT "_pages_v_blocks_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_locales" ADD CONSTRAINT "_pages_v_blocks_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items" ADD CONSTRAINT "_pages_v_blocks_cards_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_items_locales" ADD CONSTRAINT "_pages_v_blocks_cards_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards" ADD CONSTRAINT "_pages_v_blocks_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cards_locales" ADD CONSTRAINT "_pages_v_blocks_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_locales" ADD CONSTRAINT "_pages_v_blocks_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items" ADD CONSTRAINT "_pages_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_items_locales" ADD CONSTRAINT "_pages_v_blocks_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq" ADD CONSTRAINT "_pages_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_faq_locales" ADD CONSTRAINT "_pages_v_blocks_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video_locales" ADD CONSTRAINT "_pages_v_blocks_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote" ADD CONSTRAINT "_pages_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_quote_locales" ADD CONSTRAINT "_pages_v_blocks_quote_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_quote"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_files" ADD CONSTRAINT "_pages_v_blocks_downloads_files_file_id_documents_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_files" ADD CONSTRAINT "_pages_v_blocks_downloads_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_files_locales" ADD CONSTRAINT "_pages_v_blocks_downloads_files_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_downloads_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads" ADD CONSTRAINT "_pages_v_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_locales" ADD CONSTRAINT "_pages_v_blocks_downloads_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_buttons" ADD CONSTRAINT "_pages_v_blocks_cta_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_buttons_locales" ADD CONSTRAINT "_pages_v_blocks_cta_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_locales" ADD CONSTRAINT "_pages_v_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_banner_image_id_media_id_fk" FOREIGN KEY ("version_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_texts" ADD CONSTRAINT "_pages_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_texts" ADD CONSTRAINT "posts_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_texts" ADD CONSTRAINT "_posts_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_counters" ADD CONSTRAINT "initiatives_counters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_counters_locales" ADD CONSTRAINT "initiatives_counters_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives_counters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives" ADD CONSTRAINT "initiatives_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "initiatives_locales" ADD CONSTRAINT "initiatives_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "initiatives_locales" ADD CONSTRAINT "initiatives_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_rels" ADD CONSTRAINT "initiatives_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_rels" ADD CONSTRAINT "initiatives_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "initiatives_rels" ADD CONSTRAINT "initiatives_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_counters" ADD CONSTRAINT "_initiatives_v_version_counters_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_version_counters_locales" ADD CONSTRAINT "_initiatives_v_version_counters_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v_version_counters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v" ADD CONSTRAINT "_initiatives_v_parent_id_initiatives_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."initiatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_initiatives_v" ADD CONSTRAINT "_initiatives_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_initiatives_v_locales" ADD CONSTRAINT "_initiatives_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_initiatives_v_locales" ADD CONSTRAINT "_initiatives_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_rels" ADD CONSTRAINT "_initiatives_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_initiatives_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_rels" ADD CONSTRAINT "_initiatives_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_initiatives_v_rels" ADD CONSTRAINT "_initiatives_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_editions" ADD CONSTRAINT "events_editions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_editions_locales" ADD CONSTRAINT "events_editions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_editions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_initiative_id_initiatives_id_fk" FOREIGN KEY ("initiative_id") REFERENCES "public"."initiatives"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums" ADD CONSTRAINT "albums_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "albums_locales" ADD CONSTRAINT "albums_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "albums_rels" ADD CONSTRAINT "albums_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "videos_locales" ADD CONSTRAINT "videos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "download_photos" ADD CONSTRAINT "download_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "download_photos_locales" ADD CONSTRAINT "download_photos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."download_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quotes" ADD CONSTRAINT "quotes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quotes_locales" ADD CONSTRAINT "quotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leader_meetings" ADD CONSTRAINT "leader_meetings_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "leader_meetings_locales" ADD CONSTRAINT "leader_meetings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leader_meetings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_locales" ADD CONSTRAINT "awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "jobs_locales" ADD CONSTRAINT "jobs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offices_locales" ADD CONSTRAINT "offices_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "offices_texts" ADD CONSTRAINT "offices_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_office_id_offices_id_fk" FOREIGN KEY ("office_id") REFERENCES "public"."offices"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contact_messages" ADD CONSTRAINT "contact_messages_attachment_id_form_uploads_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."form_uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "grievances" ADD CONSTRAINT "grievances_attachment_id_form_uploads_id_fk" FOREIGN KEY ("attachment_id") REFERENCES "public"."form_uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_cv_id_form_uploads_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."form_uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents_locales" ADD CONSTRAINT "documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_initiatives_fk" FOREIGN KEY ("initiatives_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_initiatives_fk" FOREIGN KEY ("initiatives_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_albums_fk" FOREIGN KEY ("albums_id") REFERENCES "public"."albums"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_download_photos_fk" FOREIGN KEY ("download_photos_id") REFERENCES "public"."download_photos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quotes_fk" FOREIGN KEY ("quotes_id") REFERENCES "public"."quotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leader_meetings_fk" FOREIGN KEY ("leader_meetings_id") REFERENCES "public"."leader_meetings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_jobs_fk" FOREIGN KEY ("jobs_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_offices_fk" FOREIGN KEY ("offices_id") REFERENCES "public"."offices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_messages_fk" FOREIGN KEY ("contact_messages_id") REFERENCES "public"."contact_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_grievances_fk" FOREIGN KEY ("grievances_id") REFERENCES "public"."grievances"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_applications_fk" FOREIGN KEY ("job_applications_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_uploads_fk" FOREIGN KEY ("form_uploads_id") REFERENCES "public"."form_uploads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_slides_buttons" ADD CONSTRAINT "home_blocks_hero_slider_slides_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_slider_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_slides_buttons_locales" ADD CONSTRAINT "home_blocks_hero_slider_slides_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_slider_slides_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_slides" ADD CONSTRAINT "home_blocks_hero_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_slides" ADD CONSTRAINT "home_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_slides_locales" ADD CONSTRAINT "home_blocks_hero_slider_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_slider_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_badge" ADD CONSTRAINT "home_blocks_hero_slider_badge_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider_badge_locales" ADD CONSTRAINT "home_blocks_hero_slider_badge_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_hero_slider_badge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_hero_slider" ADD CONSTRAINT "home_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quick_links_items" ADD CONSTRAINT "home_blocks_quick_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quick_links_items_locales" ADD CONSTRAINT "home_blocks_quick_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_quick_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quick_links" ADD CONSTRAINT "home_blocks_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_quick_links_locales" ADD CONSTRAINT "home_blocks_quick_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_about_intro_stats" ADD CONSTRAINT "home_blocks_about_intro_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_about_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_about_intro_stats_locales" ADD CONSTRAINT "home_blocks_about_intro_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_about_intro_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_about_intro" ADD CONSTRAINT "home_blocks_about_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_about_intro" ADD CONSTRAINT "home_blocks_about_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_about_intro_locales" ADD CONSTRAINT "home_blocks_about_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_about_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_biography_items" ADD CONSTRAINT "home_blocks_biography_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_biography"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_biography_items_locales" ADD CONSTRAINT "home_blocks_biography_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_biography_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_biography" ADD CONSTRAINT "home_blocks_biography_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_biography" ADD CONSTRAINT "home_blocks_biography_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_biography_locales" ADD CONSTRAINT "home_blocks_biography_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_biography"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_featured_video_links" ADD CONSTRAINT "home_blocks_featured_video_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_featured_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_featured_video_links_locales" ADD CONSTRAINT "home_blocks_featured_video_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_featured_video_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_featured_video" ADD CONSTRAINT "home_blocks_featured_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_featured_video_locales" ADD CONSTRAINT "home_blocks_featured_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_featured_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_work_highlights_items" ADD CONSTRAINT "home_blocks_work_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_work_highlights_items" ADD CONSTRAINT "home_blocks_work_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_work_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_work_highlights_items_locales" ADD CONSTRAINT "home_blocks_work_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_work_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_work_highlights" ADD CONSTRAINT "home_blocks_work_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_work_highlights_locales" ADD CONSTRAINT "home_blocks_work_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_work_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_initiatives_showcase" ADD CONSTRAINT "home_blocks_initiatives_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_initiatives_showcase_locales" ADD CONSTRAINT "home_blocks_initiatives_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_initiatives_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_family_members" ADD CONSTRAINT "home_blocks_family_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_family_members" ADD CONSTRAINT "home_blocks_family_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_family_members_locales" ADD CONSTRAINT "home_blocks_family_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_family_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_family" ADD CONSTRAINT "home_blocks_family_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_family_locales" ADD CONSTRAINT "home_blocks_family_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_gallery" ADD CONSTRAINT "home_blocks_home_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_gallery_locales" ADD CONSTRAINT "home_blocks_home_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_stats_items" ADD CONSTRAINT "home_blocks_home_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_stats_items_locales" ADD CONSTRAINT "home_blocks_home_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_stats" ADD CONSTRAINT "home_blocks_home_stats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_home_stats" ADD CONSTRAINT "home_blocks_home_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_stats_locales" ADD CONSTRAINT "home_blocks_home_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_faq_items" ADD CONSTRAINT "home_blocks_home_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_faq_items_locales" ADD CONSTRAINT "home_blocks_home_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_faq_buttons" ADD CONSTRAINT "home_blocks_home_faq_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_faq_buttons_locales" ADD CONSTRAINT "home_blocks_home_faq_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_faq_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_faq" ADD CONSTRAINT "home_blocks_home_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_home_faq_locales" ADD CONSTRAINT "home_blocks_home_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_home_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_latest_blog" ADD CONSTRAINT "home_blocks_latest_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_latest_blog_locales" ADD CONSTRAINT "home_blocks_latest_blog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_latest_blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_social_feeds_instagram_posts" ADD CONSTRAINT "home_blocks_social_feeds_instagram_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_social_feeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_social_feeds_instagram_posts_locales" ADD CONSTRAINT "home_blocks_social_feeds_instagram_posts_locales_parent_i_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_social_feeds_instagram_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_social_feeds" ADD CONSTRAINT "home_blocks_social_feeds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_social_feeds_locales" ADD CONSTRAINT "home_blocks_social_feeds_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_social_feeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_appeal_band" ADD CONSTRAINT "home_blocks_appeal_band_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_blocks_appeal_band" ADD CONSTRAINT "home_blocks_appeal_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_appeal_band_locales" ADD CONSTRAINT "home_blocks_appeal_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_appeal_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_initiatives_fk" FOREIGN KEY ("initiatives_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_slides_buttons" ADD CONSTRAINT "_home_v_blocks_hero_slider_slides_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_slider_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_slides_buttons_locales" ADD CONSTRAINT "_home_v_blocks_hero_slider_slides_buttons_locales_parent__fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_slider_slides_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_slides" ADD CONSTRAINT "_home_v_blocks_hero_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_slides" ADD CONSTRAINT "_home_v_blocks_hero_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_slides_locales" ADD CONSTRAINT "_home_v_blocks_hero_slider_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_slider_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_badge" ADD CONSTRAINT "_home_v_blocks_hero_slider_badge_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider_badge_locales" ADD CONSTRAINT "_home_v_blocks_hero_slider_badge_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_hero_slider_badge"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_hero_slider" ADD CONSTRAINT "_home_v_blocks_hero_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_quick_links_items" ADD CONSTRAINT "_home_v_blocks_quick_links_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_quick_links_items_locales" ADD CONSTRAINT "_home_v_blocks_quick_links_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_quick_links_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_quick_links" ADD CONSTRAINT "_home_v_blocks_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_quick_links_locales" ADD CONSTRAINT "_home_v_blocks_quick_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_about_intro_stats" ADD CONSTRAINT "_home_v_blocks_about_intro_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_about_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_about_intro_stats_locales" ADD CONSTRAINT "_home_v_blocks_about_intro_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_about_intro_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_about_intro" ADD CONSTRAINT "_home_v_blocks_about_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_about_intro" ADD CONSTRAINT "_home_v_blocks_about_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_about_intro_locales" ADD CONSTRAINT "_home_v_blocks_about_intro_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_about_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_biography_items" ADD CONSTRAINT "_home_v_blocks_biography_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_biography"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_biography_items_locales" ADD CONSTRAINT "_home_v_blocks_biography_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_biography_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_biography" ADD CONSTRAINT "_home_v_blocks_biography_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_biography" ADD CONSTRAINT "_home_v_blocks_biography_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_biography_locales" ADD CONSTRAINT "_home_v_blocks_biography_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_biography"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_featured_video_links" ADD CONSTRAINT "_home_v_blocks_featured_video_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_featured_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_featured_video_links_locales" ADD CONSTRAINT "_home_v_blocks_featured_video_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_featured_video_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_featured_video" ADD CONSTRAINT "_home_v_blocks_featured_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_featured_video_locales" ADD CONSTRAINT "_home_v_blocks_featured_video_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_featured_video"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_work_highlights_items" ADD CONSTRAINT "_home_v_blocks_work_highlights_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_work_highlights_items" ADD CONSTRAINT "_home_v_blocks_work_highlights_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_work_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_work_highlights_items_locales" ADD CONSTRAINT "_home_v_blocks_work_highlights_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_work_highlights_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_work_highlights" ADD CONSTRAINT "_home_v_blocks_work_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_work_highlights_locales" ADD CONSTRAINT "_home_v_blocks_work_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_work_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_initiatives_showcase" ADD CONSTRAINT "_home_v_blocks_initiatives_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_initiatives_showcase_locales" ADD CONSTRAINT "_home_v_blocks_initiatives_showcase_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_initiatives_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_family_members" ADD CONSTRAINT "_home_v_blocks_family_members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_family_members" ADD CONSTRAINT "_home_v_blocks_family_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_family_members_locales" ADD CONSTRAINT "_home_v_blocks_family_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_family_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_family" ADD CONSTRAINT "_home_v_blocks_family_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_family_locales" ADD CONSTRAINT "_home_v_blocks_family_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_family"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_gallery" ADD CONSTRAINT "_home_v_blocks_home_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_gallery_locales" ADD CONSTRAINT "_home_v_blocks_home_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_stats_items" ADD CONSTRAINT "_home_v_blocks_home_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_stats_items_locales" ADD CONSTRAINT "_home_v_blocks_home_stats_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_stats_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_stats" ADD CONSTRAINT "_home_v_blocks_home_stats_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_stats" ADD CONSTRAINT "_home_v_blocks_home_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_stats_locales" ADD CONSTRAINT "_home_v_blocks_home_stats_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_faq_items" ADD CONSTRAINT "_home_v_blocks_home_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_faq_items_locales" ADD CONSTRAINT "_home_v_blocks_home_faq_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_faq_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_faq_buttons" ADD CONSTRAINT "_home_v_blocks_home_faq_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_faq_buttons_locales" ADD CONSTRAINT "_home_v_blocks_home_faq_buttons_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_faq_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_faq" ADD CONSTRAINT "_home_v_blocks_home_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_home_faq_locales" ADD CONSTRAINT "_home_v_blocks_home_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_home_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_latest_blog" ADD CONSTRAINT "_home_v_blocks_latest_blog_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_latest_blog_locales" ADD CONSTRAINT "_home_v_blocks_latest_blog_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_latest_blog"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_social_feeds_instagram_posts" ADD CONSTRAINT "_home_v_blocks_social_feeds_instagram_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_social_feeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_social_feeds_instagram_posts_locales" ADD CONSTRAINT "_home_v_blocks_social_feeds_instagram_posts_locales_paren_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_social_feeds_instagram_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_social_feeds" ADD CONSTRAINT "_home_v_blocks_social_feeds_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_social_feeds_locales" ADD CONSTRAINT "_home_v_blocks_social_feeds_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_social_feeds"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_appeal_band" ADD CONSTRAINT "_home_v_blocks_appeal_band_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_appeal_band" ADD CONSTRAINT "_home_v_blocks_appeal_band_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_blocks_appeal_band_locales" ADD CONSTRAINT "_home_v_blocks_appeal_band_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v_blocks_appeal_band"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_v_locales" ADD CONSTRAINT "_home_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_initiatives_fk" FOREIGN KEY ("initiatives_id") REFERENCES "public"."initiatives"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_v_rels" ADD CONSTRAINT "_home_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_children_sub_items" ADD CONSTRAINT "header_nav_children_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_children_sub_items_locales" ADD CONSTRAINT "header_nav_children_sub_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_children_sub_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_children" ADD CONSTRAINT "header_nav_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_children_locales" ADD CONSTRAINT "header_nav_children_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_children"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav" ADD CONSTRAINT "header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_locales" ADD CONSTRAINT "header_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links" ADD CONSTRAINT "footer_legal_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_legal_links_locales" ADD CONSTRAINT "footer_legal_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_legal_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_share_image_id_media_id_fk" FOREIGN KEY ("default_share_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_profile_pdf_id_documents_id_fk" FOREIGN KEY ("profile_pdf_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "popup" ADD CONSTRAINT "popup_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "popup_locales" ADD CONSTRAINT "popup_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popup"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_content_locales_locale_parent_id_unique" ON "pages_blocks_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_text_buttons_order_idx" ON "pages_blocks_media_text_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_text_buttons_parent_id_idx" ON "pages_blocks_media_text_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_media_text_buttons_locales_locale_parent_id_uni" ON "pages_blocks_media_text_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_media_text_order_idx" ON "pages_blocks_media_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_media_text_parent_id_idx" ON "pages_blocks_media_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_media_text_path_idx" ON "pages_blocks_media_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_media_text_image_idx" ON "pages_blocks_media_text" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_media_text_locales_locale_parent_id_unique" ON "pages_blocks_media_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_stats_items_locales_locale_parent_id_unique" ON "pages_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_stats_locales_locale_parent_id_unique" ON "pages_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cards_items_order_idx" ON "pages_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_items_parent_id_idx" ON "pages_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_items_image_idx" ON "pages_blocks_cards_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_cards_items_locales_locale_parent_id_unique" ON "pages_blocks_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cards_order_idx" ON "pages_blocks_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_cards_parent_id_idx" ON "pages_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cards_path_idx" ON "pages_blocks_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_cards_locales_locale_parent_id_unique" ON "pages_blocks_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_gallery_locales_locale_parent_id_unique" ON "pages_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_items_order_idx" ON "pages_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_items_parent_id_idx" ON "pages_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_faq_items_locales_locale_parent_id_unique" ON "pages_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_faq_locales_locale_parent_id_unique" ON "pages_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_video_locales_locale_parent_id_unique" ON "pages_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_quote_order_idx" ON "pages_blocks_quote" USING btree ("_order");
  CREATE INDEX "pages_blocks_quote_parent_id_idx" ON "pages_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_quote_path_idx" ON "pages_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_quote_locales_locale_parent_id_unique" ON "pages_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_downloads_files_order_idx" ON "pages_blocks_downloads_files" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_files_parent_id_idx" ON "pages_blocks_downloads_files" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_files_file_idx" ON "pages_blocks_downloads_files" USING btree ("file_id");
  CREATE UNIQUE INDEX "pages_blocks_downloads_files_locales_locale_parent_id_unique" ON "pages_blocks_downloads_files_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_downloads_order_idx" ON "pages_blocks_downloads" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_parent_id_idx" ON "pages_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_path_idx" ON "pages_blocks_downloads" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_downloads_locales_locale_parent_id_unique" ON "pages_blocks_downloads_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_buttons_order_idx" ON "pages_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_buttons_parent_id_idx" ON "pages_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_buttons_locales_locale_parent_id_unique" ON "pages_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_image_idx" ON "pages_blocks_cta" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_cta_locales_locale_parent_id_unique" ON "pages_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_path_idx" ON "pages" USING btree ("path");
  CREATE INDEX "pages_banner_image_idx" ON "pages" USING btree ("banner_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_texts_order_parent" ON "pages_texts" USING btree ("order","parent_id");
  CREATE INDEX "pages_texts_locale_parent" ON "pages_texts" USING btree ("locale","parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_media_id_idx" ON "pages_rels" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_content_order_idx" ON "_pages_v_blocks_content" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_content_parent_id_idx" ON "_pages_v_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_content_path_idx" ON "_pages_v_blocks_content" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_content_locales_locale_parent_id_unique" ON "_pages_v_blocks_content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_buttons_order_idx" ON "_pages_v_blocks_media_text_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_text_buttons_parent_id_idx" ON "_pages_v_blocks_media_text_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_text_buttons_locales_locale_parent_id_" ON "_pages_v_blocks_media_text_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_order_idx" ON "_pages_v_blocks_media_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_media_text_parent_id_idx" ON "_pages_v_blocks_media_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_media_text_path_idx" ON "_pages_v_blocks_media_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_media_text_image_idx" ON "_pages_v_blocks_media_text" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_media_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_media_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_stats_locales_locale_parent_id_unique" ON "_pages_v_blocks_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_items_order_idx" ON "_pages_v_blocks_cards_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_items_parent_id_idx" ON "_pages_v_blocks_cards_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_items_image_idx" ON "_pages_v_blocks_cards_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cards_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_cards_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_order_idx" ON "_pages_v_blocks_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cards_parent_id_idx" ON "_pages_v_blocks_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cards_path_idx" ON "_pages_v_blocks_cards" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_cards_locales_locale_parent_id_unique" ON "_pages_v_blocks_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_gallery_locales_locale_parent_id_unique" ON "_pages_v_blocks_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_items_order_idx" ON "_pages_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_items_parent_id_idx" ON "_pages_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_items_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_order_idx" ON "_pages_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_faq_parent_id_idx" ON "_pages_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_faq_path_idx" ON "_pages_v_blocks_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_faq_locales_locale_parent_id_unique" ON "_pages_v_blocks_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_video_locales_locale_parent_id_unique" ON "_pages_v_blocks_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_order_idx" ON "_pages_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_quote_parent_id_idx" ON "_pages_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_quote_path_idx" ON "_pages_v_blocks_quote" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_quote_locales_locale_parent_id_unique" ON "_pages_v_blocks_quote_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_files_order_idx" ON "_pages_v_blocks_downloads_files" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_files_parent_id_idx" ON "_pages_v_blocks_downloads_files" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_files_file_idx" ON "_pages_v_blocks_downloads_files" USING btree ("file_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_downloads_files_locales_locale_parent_id_uni" ON "_pages_v_blocks_downloads_files_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_order_idx" ON "_pages_v_blocks_downloads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_parent_id_idx" ON "_pages_v_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_path_idx" ON "_pages_v_blocks_downloads" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_downloads_locales_locale_parent_id_unique" ON "_pages_v_blocks_downloads_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_buttons_order_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_buttons_parent_id_idx" ON "_pages_v_blocks_cta_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_buttons_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_image_idx" ON "_pages_v_blocks_cta" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_cta_locales_locale_parent_id_unique" ON "_pages_v_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "_pages_v" USING btree ("version_path");
  CREATE INDEX "_pages_v_version_version_banner_image_idx" ON "_pages_v" USING btree ("version_banner_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_texts_order_parent" ON "_pages_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_pages_v_texts_locale_parent" ON "_pages_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_media_id_idx" ON "_pages_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_texts_order_parent" ON "posts_texts" USING btree ("order","parent_id");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_cover_image_idx" ON "_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_version_meta_version_meta_image_idx" ON "_posts_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_texts_order_parent" ON "_posts_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "initiatives_counters_order_idx" ON "initiatives_counters" USING btree ("_order");
  CREATE INDEX "initiatives_counters_parent_id_idx" ON "initiatives_counters" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "initiatives_counters_locales_locale_parent_id_unique" ON "initiatives_counters_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "initiatives_slug_idx" ON "initiatives" USING btree ("slug");
  CREATE INDEX "initiatives_hero_image_idx" ON "initiatives" USING btree ("hero_image_id");
  CREATE INDEX "initiatives_updated_at_idx" ON "initiatives" USING btree ("updated_at");
  CREATE INDEX "initiatives_created_at_idx" ON "initiatives" USING btree ("created_at");
  CREATE INDEX "initiatives__status_idx" ON "initiatives" USING btree ("_status");
  CREATE INDEX "initiatives_meta_meta_image_idx" ON "initiatives_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "initiatives_locales_locale_parent_id_unique" ON "initiatives_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "initiatives_rels_order_idx" ON "initiatives_rels" USING btree ("order");
  CREATE INDEX "initiatives_rels_parent_idx" ON "initiatives_rels" USING btree ("parent_id");
  CREATE INDEX "initiatives_rels_path_idx" ON "initiatives_rels" USING btree ("path");
  CREATE INDEX "initiatives_rels_media_id_idx" ON "initiatives_rels" USING btree ("media_id");
  CREATE INDEX "initiatives_rels_posts_id_idx" ON "initiatives_rels" USING btree ("posts_id");
  CREATE INDEX "_initiatives_v_version_counters_order_idx" ON "_initiatives_v_version_counters" USING btree ("_order");
  CREATE INDEX "_initiatives_v_version_counters_parent_id_idx" ON "_initiatives_v_version_counters" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_initiatives_v_version_counters_locales_locale_parent_id_uni" ON "_initiatives_v_version_counters_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_initiatives_v_parent_idx" ON "_initiatives_v" USING btree ("parent_id");
  CREATE INDEX "_initiatives_v_version_version_slug_idx" ON "_initiatives_v" USING btree ("version_slug");
  CREATE INDEX "_initiatives_v_version_version_hero_image_idx" ON "_initiatives_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_initiatives_v_version_version_updated_at_idx" ON "_initiatives_v" USING btree ("version_updated_at");
  CREATE INDEX "_initiatives_v_version_version_created_at_idx" ON "_initiatives_v" USING btree ("version_created_at");
  CREATE INDEX "_initiatives_v_version_version__status_idx" ON "_initiatives_v" USING btree ("version__status");
  CREATE INDEX "_initiatives_v_created_at_idx" ON "_initiatives_v" USING btree ("created_at");
  CREATE INDEX "_initiatives_v_updated_at_idx" ON "_initiatives_v" USING btree ("updated_at");
  CREATE INDEX "_initiatives_v_snapshot_idx" ON "_initiatives_v" USING btree ("snapshot");
  CREATE INDEX "_initiatives_v_published_locale_idx" ON "_initiatives_v" USING btree ("published_locale");
  CREATE INDEX "_initiatives_v_latest_idx" ON "_initiatives_v" USING btree ("latest");
  CREATE INDEX "_initiatives_v_version_meta_version_meta_image_idx" ON "_initiatives_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_initiatives_v_locales_locale_parent_id_unique" ON "_initiatives_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_initiatives_v_rels_order_idx" ON "_initiatives_v_rels" USING btree ("order");
  CREATE INDEX "_initiatives_v_rels_parent_idx" ON "_initiatives_v_rels" USING btree ("parent_id");
  CREATE INDEX "_initiatives_v_rels_path_idx" ON "_initiatives_v_rels" USING btree ("path");
  CREATE INDEX "_initiatives_v_rels_media_id_idx" ON "_initiatives_v_rels" USING btree ("media_id");
  CREATE INDEX "_initiatives_v_rels_posts_id_idx" ON "_initiatives_v_rels" USING btree ("posts_id");
  CREATE INDEX "events_editions_order_idx" ON "events_editions" USING btree ("_order");
  CREATE INDEX "events_editions_parent_id_idx" ON "events_editions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "events_editions_locales_locale_parent_id_unique" ON "events_editions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_initiative_idx" ON "events" USING btree ("initiative_id");
  CREATE INDEX "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_media_id_idx" ON "events_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "albums_slug_idx" ON "albums" USING btree ("slug");
  CREATE INDEX "albums_cover_idx" ON "albums" USING btree ("cover_id");
  CREATE INDEX "albums_updated_at_idx" ON "albums" USING btree ("updated_at");
  CREATE INDEX "albums_created_at_idx" ON "albums" USING btree ("created_at");
  CREATE UNIQUE INDEX "albums_locales_locale_parent_id_unique" ON "albums_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "albums_rels_order_idx" ON "albums_rels" USING btree ("order");
  CREATE INDEX "albums_rels_parent_idx" ON "albums_rels" USING btree ("parent_id");
  CREATE INDEX "albums_rels_path_idx" ON "albums_rels" USING btree ("path");
  CREATE INDEX "albums_rels_media_id_idx" ON "albums_rels" USING btree ("media_id");
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_locales_locale_parent_id_unique" ON "videos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "download_photos_image_idx" ON "download_photos" USING btree ("image_id");
  CREATE INDEX "download_photos_updated_at_idx" ON "download_photos" USING btree ("updated_at");
  CREATE INDEX "download_photos_created_at_idx" ON "download_photos" USING btree ("created_at");
  CREATE UNIQUE INDEX "download_photos_locales_locale_parent_id_unique" ON "download_photos_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "quotes_image_idx" ON "quotes" USING btree ("image_id");
  CREATE INDEX "quotes_updated_at_idx" ON "quotes" USING btree ("updated_at");
  CREATE INDEX "quotes_created_at_idx" ON "quotes" USING btree ("created_at");
  CREATE UNIQUE INDEX "quotes_locales_locale_parent_id_unique" ON "quotes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leader_meetings_image_idx" ON "leader_meetings" USING btree ("image_id");
  CREATE INDEX "leader_meetings_updated_at_idx" ON "leader_meetings" USING btree ("updated_at");
  CREATE INDEX "leader_meetings_created_at_idx" ON "leader_meetings" USING btree ("created_at");
  CREATE UNIQUE INDEX "leader_meetings_locales_locale_parent_id_unique" ON "leader_meetings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "awards_image_idx" ON "awards" USING btree ("image_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE UNIQUE INDEX "awards_locales_locale_parent_id_unique" ON "awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "jobs_updated_at_idx" ON "jobs" USING btree ("updated_at");
  CREATE INDEX "jobs_created_at_idx" ON "jobs" USING btree ("created_at");
  CREATE UNIQUE INDEX "jobs_locales_locale_parent_id_unique" ON "jobs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offices_updated_at_idx" ON "offices" USING btree ("updated_at");
  CREATE INDEX "offices_created_at_idx" ON "offices" USING btree ("created_at");
  CREATE UNIQUE INDEX "offices_locales_locale_parent_id_unique" ON "offices_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "offices_texts_order_parent" ON "offices_texts" USING btree ("order","parent_id");
  CREATE INDEX "contact_messages_office_idx" ON "contact_messages" USING btree ("office_id");
  CREATE INDEX "contact_messages_attachment_idx" ON "contact_messages" USING btree ("attachment_id");
  CREATE INDEX "contact_messages_updated_at_idx" ON "contact_messages" USING btree ("updated_at");
  CREATE INDEX "contact_messages_created_at_idx" ON "contact_messages" USING btree ("created_at");
  CREATE INDEX "grievances_attachment_idx" ON "grievances" USING btree ("attachment_id");
  CREATE INDEX "grievances_updated_at_idx" ON "grievances" USING btree ("updated_at");
  CREATE INDEX "grievances_created_at_idx" ON "grievances" USING btree ("created_at");
  CREATE INDEX "job_applications_job_idx" ON "job_applications" USING btree ("job_id");
  CREATE INDEX "job_applications_cv_idx" ON "job_applications" USING btree ("cv_id");
  CREATE INDEX "job_applications_updated_at_idx" ON "job_applications" USING btree ("updated_at");
  CREATE INDEX "job_applications_created_at_idx" ON "job_applications" USING btree ("created_at");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_filename_idx" ON "documents" USING btree ("filename");
  CREATE UNIQUE INDEX "documents_locales_locale_parent_id_unique" ON "documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_uploads_updated_at_idx" ON "form_uploads" USING btree ("updated_at");
  CREATE INDEX "form_uploads_created_at_idx" ON "form_uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX "form_uploads_filename_idx" ON "form_uploads" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX "search_rels_pages_id_idx" ON "search_rels" USING btree ("pages_id");
  CREATE INDEX "search_rels_posts_id_idx" ON "search_rels" USING btree ("posts_id");
  CREATE INDEX "search_rels_initiatives_id_idx" ON "search_rels" USING btree ("initiatives_id");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_initiatives_id_idx" ON "payload_locked_documents_rels" USING btree ("initiatives_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_albums_id_idx" ON "payload_locked_documents_rels" USING btree ("albums_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");
  CREATE INDEX "payload_locked_documents_rels_download_photos_id_idx" ON "payload_locked_documents_rels" USING btree ("download_photos_id");
  CREATE INDEX "payload_locked_documents_rels_quotes_id_idx" ON "payload_locked_documents_rels" USING btree ("quotes_id");
  CREATE INDEX "payload_locked_documents_rels_leader_meetings_id_idx" ON "payload_locked_documents_rels" USING btree ("leader_meetings_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("jobs_id");
  CREATE INDEX "payload_locked_documents_rels_offices_id_idx" ON "payload_locked_documents_rels" USING btree ("offices_id");
  CREATE INDEX "payload_locked_documents_rels_contact_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_messages_id");
  CREATE INDEX "payload_locked_documents_rels_grievances_id_idx" ON "payload_locked_documents_rels" USING btree ("grievances_id");
  CREATE INDEX "payload_locked_documents_rels_job_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("job_applications_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_form_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("form_uploads_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_blocks_hero_slider_slides_buttons_order_idx" ON "home_blocks_hero_slider_slides_buttons" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_slider_slides_buttons_parent_id_idx" ON "home_blocks_hero_slider_slides_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_hero_slider_slides_buttons_locales_locale_parent" ON "home_blocks_hero_slider_slides_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_hero_slider_slides_order_idx" ON "home_blocks_hero_slider_slides" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_slider_slides_parent_id_idx" ON "home_blocks_hero_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_slider_slides_image_idx" ON "home_blocks_hero_slider_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_hero_slider_slides_locales_locale_parent_id_uniq" ON "home_blocks_hero_slider_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_hero_slider_badge_order_idx" ON "home_blocks_hero_slider_badge" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_slider_badge_parent_id_idx" ON "home_blocks_hero_slider_badge" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_hero_slider_badge_locales_locale_parent_id_uniqu" ON "home_blocks_hero_slider_badge_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_hero_slider_order_idx" ON "home_blocks_hero_slider" USING btree ("_order");
  CREATE INDEX "home_blocks_hero_slider_parent_id_idx" ON "home_blocks_hero_slider" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_hero_slider_path_idx" ON "home_blocks_hero_slider" USING btree ("_path");
  CREATE INDEX "home_blocks_quick_links_items_order_idx" ON "home_blocks_quick_links_items" USING btree ("_order");
  CREATE INDEX "home_blocks_quick_links_items_parent_id_idx" ON "home_blocks_quick_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_quick_links_items_locales_locale_parent_id_uniqu" ON "home_blocks_quick_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_quick_links_order_idx" ON "home_blocks_quick_links" USING btree ("_order");
  CREATE INDEX "home_blocks_quick_links_parent_id_idx" ON "home_blocks_quick_links" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_quick_links_path_idx" ON "home_blocks_quick_links" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_quick_links_locales_locale_parent_id_unique" ON "home_blocks_quick_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_about_intro_stats_order_idx" ON "home_blocks_about_intro_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_about_intro_stats_parent_id_idx" ON "home_blocks_about_intro_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_about_intro_stats_locales_locale_parent_id_uniqu" ON "home_blocks_about_intro_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_about_intro_order_idx" ON "home_blocks_about_intro" USING btree ("_order");
  CREATE INDEX "home_blocks_about_intro_parent_id_idx" ON "home_blocks_about_intro" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_about_intro_path_idx" ON "home_blocks_about_intro" USING btree ("_path");
  CREATE INDEX "home_blocks_about_intro_image_idx" ON "home_blocks_about_intro" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_about_intro_locales_locale_parent_id_unique" ON "home_blocks_about_intro_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_biography_items_order_idx" ON "home_blocks_biography_items" USING btree ("_order");
  CREATE INDEX "home_blocks_biography_items_parent_id_idx" ON "home_blocks_biography_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_biography_items_locales_locale_parent_id_unique" ON "home_blocks_biography_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_biography_order_idx" ON "home_blocks_biography" USING btree ("_order");
  CREATE INDEX "home_blocks_biography_parent_id_idx" ON "home_blocks_biography" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_biography_path_idx" ON "home_blocks_biography" USING btree ("_path");
  CREATE INDEX "home_blocks_biography_image_idx" ON "home_blocks_biography" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_biography_locales_locale_parent_id_unique" ON "home_blocks_biography_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_featured_video_links_order_idx" ON "home_blocks_featured_video_links" USING btree ("_order");
  CREATE INDEX "home_blocks_featured_video_links_parent_id_idx" ON "home_blocks_featured_video_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_featured_video_links_locales_locale_parent_id_un" ON "home_blocks_featured_video_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_featured_video_order_idx" ON "home_blocks_featured_video" USING btree ("_order");
  CREATE INDEX "home_blocks_featured_video_parent_id_idx" ON "home_blocks_featured_video" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_featured_video_path_idx" ON "home_blocks_featured_video" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_featured_video_locales_locale_parent_id_unique" ON "home_blocks_featured_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_work_highlights_items_order_idx" ON "home_blocks_work_highlights_items" USING btree ("_order");
  CREATE INDEX "home_blocks_work_highlights_items_parent_id_idx" ON "home_blocks_work_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_work_highlights_items_image_idx" ON "home_blocks_work_highlights_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_work_highlights_items_locales_locale_parent_id_u" ON "home_blocks_work_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_work_highlights_order_idx" ON "home_blocks_work_highlights" USING btree ("_order");
  CREATE INDEX "home_blocks_work_highlights_parent_id_idx" ON "home_blocks_work_highlights" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_work_highlights_path_idx" ON "home_blocks_work_highlights" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_work_highlights_locales_locale_parent_id_unique" ON "home_blocks_work_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_initiatives_showcase_order_idx" ON "home_blocks_initiatives_showcase" USING btree ("_order");
  CREATE INDEX "home_blocks_initiatives_showcase_parent_id_idx" ON "home_blocks_initiatives_showcase" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_initiatives_showcase_path_idx" ON "home_blocks_initiatives_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_initiatives_showcase_locales_locale_parent_id_un" ON "home_blocks_initiatives_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_family_members_order_idx" ON "home_blocks_family_members" USING btree ("_order");
  CREATE INDEX "home_blocks_family_members_parent_id_idx" ON "home_blocks_family_members" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_family_members_image_idx" ON "home_blocks_family_members" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_family_members_locales_locale_parent_id_unique" ON "home_blocks_family_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_family_order_idx" ON "home_blocks_family" USING btree ("_order");
  CREATE INDEX "home_blocks_family_parent_id_idx" ON "home_blocks_family" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_family_path_idx" ON "home_blocks_family" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_family_locales_locale_parent_id_unique" ON "home_blocks_family_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_gallery_order_idx" ON "home_blocks_home_gallery" USING btree ("_order");
  CREATE INDEX "home_blocks_home_gallery_parent_id_idx" ON "home_blocks_home_gallery" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_gallery_path_idx" ON "home_blocks_home_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_home_gallery_locales_locale_parent_id_unique" ON "home_blocks_home_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_stats_items_order_idx" ON "home_blocks_home_stats_items" USING btree ("_order");
  CREATE INDEX "home_blocks_home_stats_items_parent_id_idx" ON "home_blocks_home_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_home_stats_items_locales_locale_parent_id_unique" ON "home_blocks_home_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_stats_order_idx" ON "home_blocks_home_stats" USING btree ("_order");
  CREATE INDEX "home_blocks_home_stats_parent_id_idx" ON "home_blocks_home_stats" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_stats_path_idx" ON "home_blocks_home_stats" USING btree ("_path");
  CREATE INDEX "home_blocks_home_stats_image_idx" ON "home_blocks_home_stats" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_home_stats_locales_locale_parent_id_unique" ON "home_blocks_home_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_faq_items_order_idx" ON "home_blocks_home_faq_items" USING btree ("_order");
  CREATE INDEX "home_blocks_home_faq_items_parent_id_idx" ON "home_blocks_home_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_home_faq_items_locales_locale_parent_id_unique" ON "home_blocks_home_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_faq_buttons_order_idx" ON "home_blocks_home_faq_buttons" USING btree ("_order");
  CREATE INDEX "home_blocks_home_faq_buttons_parent_id_idx" ON "home_blocks_home_faq_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_home_faq_buttons_locales_locale_parent_id_unique" ON "home_blocks_home_faq_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_home_faq_order_idx" ON "home_blocks_home_faq" USING btree ("_order");
  CREATE INDEX "home_blocks_home_faq_parent_id_idx" ON "home_blocks_home_faq" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_home_faq_path_idx" ON "home_blocks_home_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_home_faq_locales_locale_parent_id_unique" ON "home_blocks_home_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_latest_blog_order_idx" ON "home_blocks_latest_blog" USING btree ("_order");
  CREATE INDEX "home_blocks_latest_blog_parent_id_idx" ON "home_blocks_latest_blog" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_latest_blog_path_idx" ON "home_blocks_latest_blog" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_latest_blog_locales_locale_parent_id_unique" ON "home_blocks_latest_blog_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_social_feeds_instagram_posts_order_idx" ON "home_blocks_social_feeds_instagram_posts" USING btree ("_order");
  CREATE INDEX "home_blocks_social_feeds_instagram_posts_parent_id_idx" ON "home_blocks_social_feeds_instagram_posts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_blocks_social_feeds_instagram_posts_locales_locale_pare" ON "home_blocks_social_feeds_instagram_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_social_feeds_order_idx" ON "home_blocks_social_feeds" USING btree ("_order");
  CREATE INDEX "home_blocks_social_feeds_parent_id_idx" ON "home_blocks_social_feeds" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_social_feeds_path_idx" ON "home_blocks_social_feeds" USING btree ("_path");
  CREATE UNIQUE INDEX "home_blocks_social_feeds_locales_locale_parent_id_unique" ON "home_blocks_social_feeds_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_blocks_appeal_band_order_idx" ON "home_blocks_appeal_band" USING btree ("_order");
  CREATE INDEX "home_blocks_appeal_band_parent_id_idx" ON "home_blocks_appeal_band" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_appeal_band_path_idx" ON "home_blocks_appeal_band" USING btree ("_path");
  CREATE INDEX "home_blocks_appeal_band_image_idx" ON "home_blocks_appeal_band" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_blocks_appeal_band_locales_locale_parent_id_unique" ON "home_blocks_appeal_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home__status_idx" ON "home" USING btree ("_status");
  CREATE INDEX "home_meta_meta_image_idx" ON "home_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_initiatives_id_idx" ON "home_rels" USING btree ("initiatives_id");
  CREATE INDEX "home_rels_media_id_idx" ON "home_rels" USING btree ("media_id");
  CREATE INDEX "_home_v_blocks_hero_slider_slides_buttons_order_idx" ON "_home_v_blocks_hero_slider_slides_buttons" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_slider_slides_buttons_parent_id_idx" ON "_home_v_blocks_hero_slider_slides_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_hero_slider_slides_buttons_locales_locale_par" ON "_home_v_blocks_hero_slider_slides_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_hero_slider_slides_order_idx" ON "_home_v_blocks_hero_slider_slides" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_slider_slides_parent_id_idx" ON "_home_v_blocks_hero_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_slider_slides_image_idx" ON "_home_v_blocks_hero_slider_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_hero_slider_slides_locales_locale_parent_id_u" ON "_home_v_blocks_hero_slider_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_hero_slider_badge_order_idx" ON "_home_v_blocks_hero_slider_badge" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_slider_badge_parent_id_idx" ON "_home_v_blocks_hero_slider_badge" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_hero_slider_badge_locales_locale_parent_id_un" ON "_home_v_blocks_hero_slider_badge_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_hero_slider_order_idx" ON "_home_v_blocks_hero_slider" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_hero_slider_parent_id_idx" ON "_home_v_blocks_hero_slider" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_hero_slider_path_idx" ON "_home_v_blocks_hero_slider" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_quick_links_items_order_idx" ON "_home_v_blocks_quick_links_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_quick_links_items_parent_id_idx" ON "_home_v_blocks_quick_links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_quick_links_items_locales_locale_parent_id_un" ON "_home_v_blocks_quick_links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_quick_links_order_idx" ON "_home_v_blocks_quick_links" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_quick_links_parent_id_idx" ON "_home_v_blocks_quick_links" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_quick_links_path_idx" ON "_home_v_blocks_quick_links" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_quick_links_locales_locale_parent_id_unique" ON "_home_v_blocks_quick_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_about_intro_stats_order_idx" ON "_home_v_blocks_about_intro_stats" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_about_intro_stats_parent_id_idx" ON "_home_v_blocks_about_intro_stats" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_about_intro_stats_locales_locale_parent_id_un" ON "_home_v_blocks_about_intro_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_about_intro_order_idx" ON "_home_v_blocks_about_intro" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_about_intro_parent_id_idx" ON "_home_v_blocks_about_intro" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_about_intro_path_idx" ON "_home_v_blocks_about_intro" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_about_intro_image_idx" ON "_home_v_blocks_about_intro" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_about_intro_locales_locale_parent_id_unique" ON "_home_v_blocks_about_intro_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_biography_items_order_idx" ON "_home_v_blocks_biography_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_biography_items_parent_id_idx" ON "_home_v_blocks_biography_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_biography_items_locales_locale_parent_id_uniq" ON "_home_v_blocks_biography_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_biography_order_idx" ON "_home_v_blocks_biography" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_biography_parent_id_idx" ON "_home_v_blocks_biography" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_biography_path_idx" ON "_home_v_blocks_biography" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_biography_image_idx" ON "_home_v_blocks_biography" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_biography_locales_locale_parent_id_unique" ON "_home_v_blocks_biography_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_featured_video_links_order_idx" ON "_home_v_blocks_featured_video_links" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_featured_video_links_parent_id_idx" ON "_home_v_blocks_featured_video_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_featured_video_links_locales_locale_parent_id" ON "_home_v_blocks_featured_video_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_featured_video_order_idx" ON "_home_v_blocks_featured_video" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_featured_video_parent_id_idx" ON "_home_v_blocks_featured_video" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_featured_video_path_idx" ON "_home_v_blocks_featured_video" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_featured_video_locales_locale_parent_id_uniqu" ON "_home_v_blocks_featured_video_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_work_highlights_items_order_idx" ON "_home_v_blocks_work_highlights_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_work_highlights_items_parent_id_idx" ON "_home_v_blocks_work_highlights_items" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_work_highlights_items_image_idx" ON "_home_v_blocks_work_highlights_items" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_work_highlights_items_locales_locale_parent_i" ON "_home_v_blocks_work_highlights_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_work_highlights_order_idx" ON "_home_v_blocks_work_highlights" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_work_highlights_parent_id_idx" ON "_home_v_blocks_work_highlights" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_work_highlights_path_idx" ON "_home_v_blocks_work_highlights" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_work_highlights_locales_locale_parent_id_uniq" ON "_home_v_blocks_work_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_initiatives_showcase_order_idx" ON "_home_v_blocks_initiatives_showcase" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_initiatives_showcase_parent_id_idx" ON "_home_v_blocks_initiatives_showcase" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_initiatives_showcase_path_idx" ON "_home_v_blocks_initiatives_showcase" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_initiatives_showcase_locales_locale_parent_id" ON "_home_v_blocks_initiatives_showcase_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_family_members_order_idx" ON "_home_v_blocks_family_members" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_family_members_parent_id_idx" ON "_home_v_blocks_family_members" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_family_members_image_idx" ON "_home_v_blocks_family_members" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_family_members_locales_locale_parent_id_uniqu" ON "_home_v_blocks_family_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_family_order_idx" ON "_home_v_blocks_family" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_family_parent_id_idx" ON "_home_v_blocks_family" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_family_path_idx" ON "_home_v_blocks_family" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_family_locales_locale_parent_id_unique" ON "_home_v_blocks_family_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_gallery_order_idx" ON "_home_v_blocks_home_gallery" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_gallery_parent_id_idx" ON "_home_v_blocks_home_gallery" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_gallery_path_idx" ON "_home_v_blocks_home_gallery" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_home_gallery_locales_locale_parent_id_unique" ON "_home_v_blocks_home_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_stats_items_order_idx" ON "_home_v_blocks_home_stats_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_stats_items_parent_id_idx" ON "_home_v_blocks_home_stats_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_stats_items_locales_locale_parent_id_uni" ON "_home_v_blocks_home_stats_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_stats_order_idx" ON "_home_v_blocks_home_stats" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_stats_parent_id_idx" ON "_home_v_blocks_home_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_stats_path_idx" ON "_home_v_blocks_home_stats" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_home_stats_image_idx" ON "_home_v_blocks_home_stats" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_stats_locales_locale_parent_id_unique" ON "_home_v_blocks_home_stats_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_faq_items_order_idx" ON "_home_v_blocks_home_faq_items" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_faq_items_parent_id_idx" ON "_home_v_blocks_home_faq_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_faq_items_locales_locale_parent_id_uniqu" ON "_home_v_blocks_home_faq_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_faq_buttons_order_idx" ON "_home_v_blocks_home_faq_buttons" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_faq_buttons_parent_id_idx" ON "_home_v_blocks_home_faq_buttons" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_home_faq_buttons_locales_locale_parent_id_uni" ON "_home_v_blocks_home_faq_buttons_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_home_faq_order_idx" ON "_home_v_blocks_home_faq" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_home_faq_parent_id_idx" ON "_home_v_blocks_home_faq" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_home_faq_path_idx" ON "_home_v_blocks_home_faq" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_home_faq_locales_locale_parent_id_unique" ON "_home_v_blocks_home_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_latest_blog_order_idx" ON "_home_v_blocks_latest_blog" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_latest_blog_parent_id_idx" ON "_home_v_blocks_latest_blog" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_latest_blog_path_idx" ON "_home_v_blocks_latest_blog" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_latest_blog_locales_locale_parent_id_unique" ON "_home_v_blocks_latest_blog_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_social_feeds_instagram_posts_order_idx" ON "_home_v_blocks_social_feeds_instagram_posts" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_social_feeds_instagram_posts_parent_id_idx" ON "_home_v_blocks_social_feeds_instagram_posts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_v_blocks_social_feeds_instagram_posts_locales_locale_p" ON "_home_v_blocks_social_feeds_instagram_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_social_feeds_order_idx" ON "_home_v_blocks_social_feeds" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_social_feeds_parent_id_idx" ON "_home_v_blocks_social_feeds" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_social_feeds_path_idx" ON "_home_v_blocks_social_feeds" USING btree ("_path");
  CREATE UNIQUE INDEX "_home_v_blocks_social_feeds_locales_locale_parent_id_unique" ON "_home_v_blocks_social_feeds_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_blocks_appeal_band_order_idx" ON "_home_v_blocks_appeal_band" USING btree ("_order");
  CREATE INDEX "_home_v_blocks_appeal_band_parent_id_idx" ON "_home_v_blocks_appeal_band" USING btree ("_parent_id");
  CREATE INDEX "_home_v_blocks_appeal_band_path_idx" ON "_home_v_blocks_appeal_band" USING btree ("_path");
  CREATE INDEX "_home_v_blocks_appeal_band_image_idx" ON "_home_v_blocks_appeal_band" USING btree ("image_id");
  CREATE UNIQUE INDEX "_home_v_blocks_appeal_band_locales_locale_parent_id_unique" ON "_home_v_blocks_appeal_band_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_version_version__status_idx" ON "_home_v" USING btree ("version__status");
  CREATE INDEX "_home_v_created_at_idx" ON "_home_v" USING btree ("created_at");
  CREATE INDEX "_home_v_updated_at_idx" ON "_home_v" USING btree ("updated_at");
  CREATE INDEX "_home_v_snapshot_idx" ON "_home_v" USING btree ("snapshot");
  CREATE INDEX "_home_v_published_locale_idx" ON "_home_v" USING btree ("published_locale");
  CREATE INDEX "_home_v_latest_idx" ON "_home_v" USING btree ("latest");
  CREATE INDEX "_home_v_version_meta_version_meta_image_idx" ON "_home_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_home_v_locales_locale_parent_id_unique" ON "_home_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_v_rels_order_idx" ON "_home_v_rels" USING btree ("order");
  CREATE INDEX "_home_v_rels_parent_idx" ON "_home_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_v_rels_path_idx" ON "_home_v_rels" USING btree ("path");
  CREATE INDEX "_home_v_rels_initiatives_id_idx" ON "_home_v_rels" USING btree ("initiatives_id");
  CREATE INDEX "_home_v_rels_media_id_idx" ON "_home_v_rels" USING btree ("media_id");
  CREATE INDEX "header_nav_children_sub_items_order_idx" ON "header_nav_children_sub_items" USING btree ("_order");
  CREATE INDEX "header_nav_children_sub_items_parent_id_idx" ON "header_nav_children_sub_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_children_sub_items_locales_locale_parent_id_uniqu" ON "header_nav_children_sub_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_children_order_idx" ON "header_nav_children" USING btree ("_order");
  CREATE INDEX "header_nav_children_parent_id_idx" ON "header_nav_children" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_children_locales_locale_parent_id_unique" ON "header_nav_children_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "header_nav_order_idx" ON "header_nav" USING btree ("_order");
  CREATE INDEX "header_nav_parent_id_idx" ON "header_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "header_nav_locales_locale_parent_id_unique" ON "header_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_legal_links_order_idx" ON "footer_legal_links" USING btree ("_order");
  CREATE INDEX "footer_legal_links_parent_id_idx" ON "footer_legal_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_legal_links_locales_locale_parent_id_unique" ON "footer_legal_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_logo_light_idx" ON "site_settings" USING btree ("logo_light_id");
  CREATE INDEX "site_settings_logo_dark_idx" ON "site_settings" USING btree ("logo_dark_id");
  CREATE INDEX "site_settings_default_share_image_idx" ON "site_settings" USING btree ("default_share_image_id");
  CREATE INDEX "site_settings_profile_pdf_idx" ON "site_settings" USING btree ("profile_pdf_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "popup_image_idx" ON "popup" USING btree ("image_id");
  CREATE UNIQUE INDEX "popup_locales_locale_parent_id_unique" ON "popup_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_content_locales" CASCADE;
  DROP TABLE "pages_blocks_media_text_buttons" CASCADE;
  DROP TABLE "pages_blocks_media_text_buttons_locales" CASCADE;
  DROP TABLE "pages_blocks_media_text" CASCADE;
  DROP TABLE "pages_blocks_media_text_locales" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats_items_locales" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_stats_locales" CASCADE;
  DROP TABLE "pages_blocks_cards_items" CASCADE;
  DROP TABLE "pages_blocks_cards_items_locales" CASCADE;
  DROP TABLE "pages_blocks_cards" CASCADE;
  DROP TABLE "pages_blocks_cards_locales" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_gallery_locales" CASCADE;
  DROP TABLE "pages_blocks_faq_items" CASCADE;
  DROP TABLE "pages_blocks_faq_items_locales" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_faq_locales" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_video_locales" CASCADE;
  DROP TABLE "pages_blocks_quote" CASCADE;
  DROP TABLE "pages_blocks_quote_locales" CASCADE;
  DROP TABLE "pages_blocks_downloads_files" CASCADE;
  DROP TABLE "pages_blocks_downloads_files_locales" CASCADE;
  DROP TABLE "pages_blocks_downloads" CASCADE;
  DROP TABLE "pages_blocks_downloads_locales" CASCADE;
  DROP TABLE "pages_blocks_cta_buttons" CASCADE;
  DROP TABLE "pages_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_cta_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_texts" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_content" CASCADE;
  DROP TABLE "_pages_v_blocks_content_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_media_text_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_media_text_buttons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_media_text" CASCADE;
  DROP TABLE "_pages_v_blocks_media_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_items" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_cards_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_items_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_faq" CASCADE;
  DROP TABLE "_pages_v_blocks_faq_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_video_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_quote" CASCADE;
  DROP TABLE "_pages_v_blocks_quote_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads_files" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads_files_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_buttons_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_cta_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_texts" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "posts_texts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "_posts_v_texts" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "initiatives_counters" CASCADE;
  DROP TABLE "initiatives_counters_locales" CASCADE;
  DROP TABLE "initiatives" CASCADE;
  DROP TABLE "initiatives_locales" CASCADE;
  DROP TABLE "initiatives_rels" CASCADE;
  DROP TABLE "_initiatives_v_version_counters" CASCADE;
  DROP TABLE "_initiatives_v_version_counters_locales" CASCADE;
  DROP TABLE "_initiatives_v" CASCADE;
  DROP TABLE "_initiatives_v_locales" CASCADE;
  DROP TABLE "_initiatives_v_rels" CASCADE;
  DROP TABLE "events_editions" CASCADE;
  DROP TABLE "events_editions_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "albums" CASCADE;
  DROP TABLE "albums_locales" CASCADE;
  DROP TABLE "albums_rels" CASCADE;
  DROP TABLE "videos" CASCADE;
  DROP TABLE "videos_locales" CASCADE;
  DROP TABLE "download_photos" CASCADE;
  DROP TABLE "download_photos_locales" CASCADE;
  DROP TABLE "quotes" CASCADE;
  DROP TABLE "quotes_locales" CASCADE;
  DROP TABLE "leader_meetings" CASCADE;
  DROP TABLE "leader_meetings_locales" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "awards_locales" CASCADE;
  DROP TABLE "jobs" CASCADE;
  DROP TABLE "jobs_locales" CASCADE;
  DROP TABLE "offices" CASCADE;
  DROP TABLE "offices_locales" CASCADE;
  DROP TABLE "offices_texts" CASCADE;
  DROP TABLE "contact_messages" CASCADE;
  DROP TABLE "grievances" CASCADE;
  DROP TABLE "job_applications" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "documents_locales" CASCADE;
  DROP TABLE "form_uploads" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_blocks_hero_slider_slides_buttons" CASCADE;
  DROP TABLE "home_blocks_hero_slider_slides_buttons_locales" CASCADE;
  DROP TABLE "home_blocks_hero_slider_slides" CASCADE;
  DROP TABLE "home_blocks_hero_slider_slides_locales" CASCADE;
  DROP TABLE "home_blocks_hero_slider_badge" CASCADE;
  DROP TABLE "home_blocks_hero_slider_badge_locales" CASCADE;
  DROP TABLE "home_blocks_hero_slider" CASCADE;
  DROP TABLE "home_blocks_quick_links_items" CASCADE;
  DROP TABLE "home_blocks_quick_links_items_locales" CASCADE;
  DROP TABLE "home_blocks_quick_links" CASCADE;
  DROP TABLE "home_blocks_quick_links_locales" CASCADE;
  DROP TABLE "home_blocks_about_intro_stats" CASCADE;
  DROP TABLE "home_blocks_about_intro_stats_locales" CASCADE;
  DROP TABLE "home_blocks_about_intro" CASCADE;
  DROP TABLE "home_blocks_about_intro_locales" CASCADE;
  DROP TABLE "home_blocks_biography_items" CASCADE;
  DROP TABLE "home_blocks_biography_items_locales" CASCADE;
  DROP TABLE "home_blocks_biography" CASCADE;
  DROP TABLE "home_blocks_biography_locales" CASCADE;
  DROP TABLE "home_blocks_featured_video_links" CASCADE;
  DROP TABLE "home_blocks_featured_video_links_locales" CASCADE;
  DROP TABLE "home_blocks_featured_video" CASCADE;
  DROP TABLE "home_blocks_featured_video_locales" CASCADE;
  DROP TABLE "home_blocks_work_highlights_items" CASCADE;
  DROP TABLE "home_blocks_work_highlights_items_locales" CASCADE;
  DROP TABLE "home_blocks_work_highlights" CASCADE;
  DROP TABLE "home_blocks_work_highlights_locales" CASCADE;
  DROP TABLE "home_blocks_initiatives_showcase" CASCADE;
  DROP TABLE "home_blocks_initiatives_showcase_locales" CASCADE;
  DROP TABLE "home_blocks_family_members" CASCADE;
  DROP TABLE "home_blocks_family_members_locales" CASCADE;
  DROP TABLE "home_blocks_family" CASCADE;
  DROP TABLE "home_blocks_family_locales" CASCADE;
  DROP TABLE "home_blocks_home_gallery" CASCADE;
  DROP TABLE "home_blocks_home_gallery_locales" CASCADE;
  DROP TABLE "home_blocks_home_stats_items" CASCADE;
  DROP TABLE "home_blocks_home_stats_items_locales" CASCADE;
  DROP TABLE "home_blocks_home_stats" CASCADE;
  DROP TABLE "home_blocks_home_stats_locales" CASCADE;
  DROP TABLE "home_blocks_home_faq_items" CASCADE;
  DROP TABLE "home_blocks_home_faq_items_locales" CASCADE;
  DROP TABLE "home_blocks_home_faq_buttons" CASCADE;
  DROP TABLE "home_blocks_home_faq_buttons_locales" CASCADE;
  DROP TABLE "home_blocks_home_faq" CASCADE;
  DROP TABLE "home_blocks_home_faq_locales" CASCADE;
  DROP TABLE "home_blocks_latest_blog" CASCADE;
  DROP TABLE "home_blocks_latest_blog_locales" CASCADE;
  DROP TABLE "home_blocks_social_feeds_instagram_posts" CASCADE;
  DROP TABLE "home_blocks_social_feeds_instagram_posts_locales" CASCADE;
  DROP TABLE "home_blocks_social_feeds" CASCADE;
  DROP TABLE "home_blocks_social_feeds_locales" CASCADE;
  DROP TABLE "home_blocks_appeal_band" CASCADE;
  DROP TABLE "home_blocks_appeal_band_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slider_slides_buttons" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slider_slides_buttons_locales" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slider_slides" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slider_slides_locales" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slider_badge" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slider_badge_locales" CASCADE;
  DROP TABLE "_home_v_blocks_hero_slider" CASCADE;
  DROP TABLE "_home_v_blocks_quick_links_items" CASCADE;
  DROP TABLE "_home_v_blocks_quick_links_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_quick_links" CASCADE;
  DROP TABLE "_home_v_blocks_quick_links_locales" CASCADE;
  DROP TABLE "_home_v_blocks_about_intro_stats" CASCADE;
  DROP TABLE "_home_v_blocks_about_intro_stats_locales" CASCADE;
  DROP TABLE "_home_v_blocks_about_intro" CASCADE;
  DROP TABLE "_home_v_blocks_about_intro_locales" CASCADE;
  DROP TABLE "_home_v_blocks_biography_items" CASCADE;
  DROP TABLE "_home_v_blocks_biography_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_biography" CASCADE;
  DROP TABLE "_home_v_blocks_biography_locales" CASCADE;
  DROP TABLE "_home_v_blocks_featured_video_links" CASCADE;
  DROP TABLE "_home_v_blocks_featured_video_links_locales" CASCADE;
  DROP TABLE "_home_v_blocks_featured_video" CASCADE;
  DROP TABLE "_home_v_blocks_featured_video_locales" CASCADE;
  DROP TABLE "_home_v_blocks_work_highlights_items" CASCADE;
  DROP TABLE "_home_v_blocks_work_highlights_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_work_highlights" CASCADE;
  DROP TABLE "_home_v_blocks_work_highlights_locales" CASCADE;
  DROP TABLE "_home_v_blocks_initiatives_showcase" CASCADE;
  DROP TABLE "_home_v_blocks_initiatives_showcase_locales" CASCADE;
  DROP TABLE "_home_v_blocks_family_members" CASCADE;
  DROP TABLE "_home_v_blocks_family_members_locales" CASCADE;
  DROP TABLE "_home_v_blocks_family" CASCADE;
  DROP TABLE "_home_v_blocks_family_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_gallery" CASCADE;
  DROP TABLE "_home_v_blocks_home_gallery_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_stats_items" CASCADE;
  DROP TABLE "_home_v_blocks_home_stats_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_stats" CASCADE;
  DROP TABLE "_home_v_blocks_home_stats_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_faq_items" CASCADE;
  DROP TABLE "_home_v_blocks_home_faq_items_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_faq_buttons" CASCADE;
  DROP TABLE "_home_v_blocks_home_faq_buttons_locales" CASCADE;
  DROP TABLE "_home_v_blocks_home_faq" CASCADE;
  DROP TABLE "_home_v_blocks_home_faq_locales" CASCADE;
  DROP TABLE "_home_v_blocks_latest_blog" CASCADE;
  DROP TABLE "_home_v_blocks_latest_blog_locales" CASCADE;
  DROP TABLE "_home_v_blocks_social_feeds_instagram_posts" CASCADE;
  DROP TABLE "_home_v_blocks_social_feeds_instagram_posts_locales" CASCADE;
  DROP TABLE "_home_v_blocks_social_feeds" CASCADE;
  DROP TABLE "_home_v_blocks_social_feeds_locales" CASCADE;
  DROP TABLE "_home_v_blocks_appeal_band" CASCADE;
  DROP TABLE "_home_v_blocks_appeal_band_locales" CASCADE;
  DROP TABLE "_home_v" CASCADE;
  DROP TABLE "_home_v_locales" CASCADE;
  DROP TABLE "_home_v_rels" CASCADE;
  DROP TABLE "header_nav_children_sub_items" CASCADE;
  DROP TABLE "header_nav_children_sub_items_locales" CASCADE;
  DROP TABLE "header_nav_children" CASCADE;
  DROP TABLE "header_nav_children_locales" CASCADE;
  DROP TABLE "header_nav" CASCADE;
  DROP TABLE "header_nav_locales" CASCADE;
  DROP TABLE "header" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_legal_links" CASCADE;
  DROP TABLE "footer_legal_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "popup" CASCADE;
  DROP TABLE "popup_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_media_text_image_position";
  DROP TYPE "public"."enum_pages_blocks_cards_columns";
  DROP TYPE "public"."enum_pages_blocks_gallery_layout";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_media_text_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_cards_columns";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_layout";
  DROP TYPE "public"."enum__pages_v_version_section";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum_initiatives_category";
  DROP TYPE "public"."enum_initiatives_organisation";
  DROP TYPE "public"."enum_initiatives_status";
  DROP TYPE "public"."enum__initiatives_v_version_category";
  DROP TYPE "public"."enum__initiatives_v_version_organisation";
  DROP TYPE "public"."enum__initiatives_v_version_status";
  DROP TYPE "public"."enum__initiatives_v_published_locale";
  DROP TYPE "public"."enum_albums_category";
  DROP TYPE "public"."enum_quotes_category";
  DROP TYPE "public"."enum_leader_meetings_level";
  DROP TYPE "public"."enum_jobs_type";
  DROP TYPE "public"."enum_contact_messages_status";
  DROP TYPE "public"."enum_grievances_type";
  DROP TYPE "public"."enum_grievances_status";
  DROP TYPE "public"."enum_job_applications_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_locale";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_home_blocks_quick_links_items_icon";
  DROP TYPE "public"."enum_home_status";
  DROP TYPE "public"."enum__home_v_blocks_quick_links_items_icon";
  DROP TYPE "public"."enum__home_v_version_status";
  DROP TYPE "public"."enum__home_v_published_locale";`)
}
