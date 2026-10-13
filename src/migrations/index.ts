import * as migration_20261009_121052_initial from './20261009_121052_initial';
import * as migration_20261012_144129_blob_fields from './20261012_144129_blob_fields';
import * as migration_20261012_152011_hero_mobile_image from './20261012_152011_hero_mobile_image';
import * as migration_20261013_051055_hero_kicker from './20261013_051055_hero_kicker';

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
];
