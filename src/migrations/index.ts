import * as migration_20261009_121052_initial from './20261009_121052_initial';
import * as migration_20261012_144129_blob_fields from './20261012_144129_blob_fields';
import * as migration_20261012_152011_hero_mobile_image from './20261012_152011_hero_mobile_image';
import * as migration_20261013_051055_hero_kicker from './20261013_051055_hero_kicker';
import * as migration_20261013_150000_menu_restructure from './20261013_150000_menu_restructure';
import * as migration_20261014_120000_remove_thoughts_rename_biography from './20261014_120000_remove_thoughts_rename_biography';
import * as migration_20261014_150000_new_portraits from './20261014_150000_new_portraits';
import * as migration_20261014_170000_about_menu from './20261014_170000_about_menu';

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
    name: '20261013_051055_hero_kicker'
  },
  {
    up: migration_20261013_150000_menu_restructure.up,
    down: migration_20261013_150000_menu_restructure.down,
    name: '20261013_150000_menu_restructure'
  },
  {
    up: migration_20261014_120000_remove_thoughts_rename_biography.up,
    down: migration_20261014_120000_remove_thoughts_rename_biography.down,
    name: '20261014_120000_remove_thoughts_rename_biography'
  },
  {
    up: migration_20261014_150000_new_portraits.up,
    down: migration_20261014_150000_new_portraits.down,
    name: '20261014_150000_new_portraits'
  },
  {
    up: migration_20261014_170000_about_menu.up,
    down: migration_20261014_170000_about_menu.down,
    name: '20261014_170000_about_menu'
  },
];
