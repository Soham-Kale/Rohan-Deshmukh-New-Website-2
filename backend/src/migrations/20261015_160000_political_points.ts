import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'
import { applyDocTextUpdates } from '../seed/content-updates'

/** Content migration: key points under the three Political Career sections */
export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await applyDocTextUpdates(payload, ['Swami Vivekananda Vichar Yatra', 'Bharatiya Janata Yuva Morcha', 'Lok Sabha Election, Dharashiv (Osmanabad)'])
}

export async function down(_: MigrateDownArgs): Promise<void> {
  // nothing to undo
}
