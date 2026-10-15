import * as migration_20261009_121052_initial from './20261009_121052_initial';
import * as migration_20261012_144129_blob_fields from './20261012_144129_blob_fields';
import * as migration_20261012_152011_hero_mobile_image from './20261012_152011_hero_mobile_image';
import * as migration_20261013_051055_hero_kicker from './20261013_051055_hero_kicker';
import * as migration_20261013_150000_menu_restructure from './20261013_150000_menu_restructure';
import * as migration_20261014_112924_event_details from './20261014_112924_event_details';
import * as migration_20261014_120000_remove_thoughts_rename_biography from './20261014_120000_remove_thoughts_rename_biography';
import * as migration_20261014_150000_new_portraits from './20261014_150000_new_portraits';
import * as migration_20261014_170000_about_menu from './20261014_170000_about_menu';
import * as migration_20261014_180000_doc_content from './20261014_180000_doc_content';
import * as migration_20261015_110000_lokmangal_menu_intro from './20261015_110000_lokmangal_menu_intro';
import * as migration_20261015_120000_blog_excerpts from './20261015_120000_blog_excerpts';
import * as migration_20261015_130000_blog_subtitles from './20261015_130000_blog_subtitles';
import * as migration_20261015_150000_doc_text_updates from './20261015_150000_doc_text_updates';
import * as migration_20261015_160000_political_points from './20261015_160000_political_points';
import * as migration_20261015_170000_intro_journey from './20261015_170000_intro_journey';

export const migrations = [
  {
    up: migration_20261009_121052_initial.up,
    down: migration_20261009_121052_initial.down,
    name: '20261009_121052_initial',
  },
  {
    up: migration_20261012_144129_blob_fields.up,
    down: migration_20261012_144129_blob_fields.down,
    name: '20261012_144129_blob_fields',
  },
  {
    up: migration_20261012_152011_hero_mobile_image.up,
    down: migration_20261012_152011_hero_mobile_image.down,
    name: '20261012_152011_hero_mobile_image',
  },
  {
    up: migration_20261013_051055_hero_kicker.up,
    down: migration_20261013_051055_hero_kicker.down,
    name: '20261013_051055_hero_kicker',
  },
  {
    up: migration_20261013_150000_menu_restructure.up,
    down: migration_20261013_150000_menu_restructure.down,
    name: '20261013_150000_menu_restructure',
  },
  {
    up: migration_20261014_112924_event_details.up,
    down: migration_20261014_112924_event_details.down,
    name: '20261014_112924_event_details',
  },
  {
    up: migration_20261014_120000_remove_thoughts_rename_biography.up,
    down: migration_20261014_120000_remove_thoughts_rename_biography.down,
    name: '20261014_120000_remove_thoughts_rename_biography',
  },
  {
    up: migration_20261014_150000_new_portraits.up,
    down: migration_20261014_150000_new_portraits.down,
    name: '20261014_150000_new_portraits',
  },
  {
    up: migration_20261014_170000_about_menu.up,
    down: migration_20261014_170000_about_menu.down,
    name: '20261014_170000_about_menu'
  },
  {
    up: migration_20261014_180000_doc_content.up,
    down: migration_20261014_180000_doc_content.down,
    name: '20261014_180000_doc_content'
  },
  {
    up: migration_20261015_110000_lokmangal_menu_intro.up,
    down: migration_20261015_110000_lokmangal_menu_intro.down,
    name: '20261015_110000_lokmangal_menu_intro'
  },
  {
    up: migration_20261015_120000_blog_excerpts.up,
    down: migration_20261015_120000_blog_excerpts.down,
    name: '20261015_120000_blog_excerpts'
  },
  {
    up: migration_20261015_130000_blog_subtitles.up,
    down: migration_20261015_130000_blog_subtitles.down,
    name: '20261015_130000_blog_subtitles'
  },
  {
    up: migration_20261015_150000_doc_text_updates.up,
    down: migration_20261015_150000_doc_text_updates.down,
    name: '20261015_150000_doc_text_updates'
  },
  {
    up: migration_20261015_160000_political_points.up,
    down: migration_20261015_160000_political_points.down,
    name: '20261015_160000_political_points'
  },
  {
    up: migration_20261015_170000_intro_journey.up,
    down: migration_20261015_170000_intro_journey.down,
    name: '20261015_170000_intro_journey'
  },
];
