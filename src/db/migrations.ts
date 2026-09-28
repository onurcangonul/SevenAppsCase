import type { SQLiteDatabase } from 'expo-sqlite';

import { SCHEMA_VERSION } from './schema';

type Migration = {
  version: number;
  up: (database: SQLiteDatabase) => Promise<void>;
};

const migrations: Migration[] = [
  {
    version: 1,
    up: async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS clips (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          uri TEXT NOT NULL,
          thumbnail_uri TEXT,
          duration_ms INTEGER NOT NULL,
          source_start_ms INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_clips_created_at ON clips (created_at DESC, id DESC);
      `);
    },
  },
];

export async function runMigrations(database: SQLiteDatabase): Promise<void> {
  await database.execAsync('PRAGMA journal_mode = WAL;');
  await database.execAsync('PRAGMA foreign_keys = ON;');

  const result = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const currentVersion = result?.user_version ?? 0;

  if (currentVersion >= SCHEMA_VERSION) {
    return;
  }

  const pending = migrations
    .filter((migration) => migration.version > currentVersion)
    .sort((a, b) => a.version - b.version);

  for (const migration of pending) {
    await database.withTransactionAsync(async () => {
      await migration.up(database);
    });
  }

  await database.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}
