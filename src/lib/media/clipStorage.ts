import { Directory, File, Paths } from 'expo-file-system';

import { AppError } from '../errors';

const CLIPS_FOLDER = 'clips';

function clipsDirectory(): Directory {
  const directory = new Directory(Paths.document, CLIPS_FOLDER);

  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }

  return directory;
}

export async function persistClipFile(sourceUri: string, clipId: string): Promise<string> {
  try {
    const source = new File(sourceUri);

    if (!source.exists) {
      throw new AppError('STORAGE_FAILED', 'The exported file could not be found.');
    }

    const extension = source.extension || '.mp4';
    const destination = new File(clipsDirectory(), `${clipId}${extension}`);

    if (destination.exists) {
      destination.delete();
    }

    await source.move(destination, { overwrite: true });

    return destination.uri;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('STORAGE_FAILED', 'The clip could not be moved into app storage.', error);
  }
}

export function removeClipFile(uri: string): void {
  try {
    const file = new File(uri);

    if (file.exists) {
      file.delete();
    }
  } catch {
    return;
  }
}
