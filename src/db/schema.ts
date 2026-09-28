export const DATABASE_NAME = 'fivesec.db';

export const SCHEMA_VERSION = 1;

export type ClipRow = {
  id: string;
  name: string;
  description: string;
  uri: string;
  thumbnail_uri: string | null;
  duration_ms: number;
  source_start_ms: number;
  created_at: number;
  updated_at: number;
};
