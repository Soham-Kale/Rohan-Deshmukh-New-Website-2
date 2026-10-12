import * as migration_20261009_121052_initial from './20261009_121052_initial';
import * as migration_20261012_144129_blob_fields from './20261012_144129_blob_fields';

export const migrations = [
  {
    up: migration_20261009_121052_initial.up,
    down: migration_20261009_121052_initial.down,
    name: '20261009_121052_initial',
  },
  {
    up: migration_20261012_144129_blob_fields.up,
    down: migration_20261012_144129_blob_fields.down,
    name: '20261012_144129_blob_fields'
  },
];
