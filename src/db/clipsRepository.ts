import { AppError } from '@/lib/errors';
import type { Clip, ClipCursor, ClipMetadata, ClipPage, NewClip } from '@/types/clip';

import { getDatabase } from './client';
import type { ClipRow } from './schema';

function toClip(row: ClipRow): Clip {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    uri: row.uri,
    thumbnailUri: row.thumbnail_uri,
    durationMs: row.duration_ms,
    sourceStartMs: row.source_start_ms,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findClipPage(cursor: ClipCursor | null, limit: number): Promise<ClipPage> {
  const database = await getDatabase();

  const rows = cursor
    ? await database.getAllAsync<ClipRow>(
        `SELECT * FROM clips
         WHERE (created_at, id) < (?, ?)
         ORDER BY created_at DESC, id DESC
         LIMIT ?`,
        [cursor.createdAt, cursor.id, limit + 1],
      )
    : await database.getAllAsync<ClipRow>(
        `SELECT * FROM clips ORDER BY created_at DESC, id DESC LIMIT ?`,
        [limit + 1],
      );

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page.at(-1);

  return {
    items: page.map(toClip),
    nextCursor: hasMore && last ? { createdAt: last.created_at, id: last.id } : null,
  };
}

export async function findClipById(id: string): Promise<Clip | null> {
  const database = await getDatabase();

  const row = await database.getFirstAsync<ClipRow>('SELECT * FROM clips WHERE id = ?', [id]);

  return row ? toClip(row) : null;
}

export async function countClips(): Promise<number> {
  const database = await getDatabase();

  const row = await database.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM clips',
  );

  return row?.total ?? 0;
}

export async function insertClip(clip: NewClip): Promise<Clip> {
  const database = await getDatabase();
  const now = Date.now();

  await database.runAsync(
    `INSERT INTO clips
      (id, name, description, uri, thumbnail_uri, duration_ms, source_start_ms, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      clip.id,
      clip.name,
      clip.description,
      clip.uri,
      clip.thumbnailUri,
      clip.durationMs,
      clip.sourceStartMs,
      now,
      now,
    ],
  );

  return { ...clip, createdAt: now, updatedAt: now };
}

export async function updateClipMetadata(id: string, metadata: ClipMetadata): Promise<Clip> {
  const database = await getDatabase();
  const now = Date.now();

  const result = await database.runAsync(
    'UPDATE clips SET name = ?, description = ?, updated_at = ? WHERE id = ?',
    [metadata.name, metadata.description, now, id],
  );

  if (result.changes === 0) {
    throw new AppError('CLIP_NOT_FOUND', 'The clip no longer exists.');
  }

  const clip = await findClipById(id);

  if (!clip) {
    throw new AppError('CLIP_NOT_FOUND', 'The clip no longer exists.');
  }

  return clip;
}

export async function deleteClipById(id: string): Promise<Clip | null> {
  const database = await getDatabase();
  const clip = await findClipById(id);

  if (!clip) {
    return null;
  }

  await database.runAsync('DELETE FROM clips WHERE id = ?', [id]);

  return clip;
}
