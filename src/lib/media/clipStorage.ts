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

async function moveIntoClips(sourceUri: string, fileName: string): Promise<string> {
  const source = new File(sourceUri);

  if (!source.exists) {
    throw new AppError('STORAGE_FAILED', 'The file to store could not be found.');
  }

  const destination = new File(clipsDirectory(), fileName);

  if (destination.exists) {
    destination.delete();
  }

  await source.move(destination, { overwrite: true });

  return destination.uri;
}

export async function persistClipFile(sourceUri: string, clipId: string): Promise<string> {
  try {
    const extension = new File(sourceUri).extension || '.mp4';

    return await moveIntoClips(sourceUri, `${clipId}${extension}`);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('STORAGE_FAILED', 'The clip could not be moved into app storage.', error);
  }
}

export async function persistThumbnailFile(
  sourceUri: string,
  clipId: string,
): Promise<string | null> {
  try {
    const extension = new File(sourceUri).extension || '.jpg';

    return await moveIntoClips(sourceUri, `${clipId}-thumbnail${extension}`);
  } catch {
    return null;
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
