import * as migration_20261009_121052_initial from './20261009_121052_initial';

export const migrations = [
  {
    up: migration_20261009_121052_initial.up,
    down: migration_20261009_121052_initial.down,
    name: '20261009_121052_initial'
  },
];
