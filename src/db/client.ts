import * as SQLite from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

import { runMigrations } from './migrations';
import { DATABASE_NAME } from './schema';

let connection: Promise<SQLiteDatabase> | null = null;

async function connect(): Promise<SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync(DATABASE_NAME);

  await runMigrations(database);

  return database;
}

export function getDatabase(): Promise<SQLiteDatabase> {
  if (!connection) {
    connection = connect().catch((error) => {
      connection = null;
      throw error;
    });
  }

  return connection;
}
