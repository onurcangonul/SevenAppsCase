export type AppErrorCode =
  | 'TRIMMER_UNAVAILABLE'
  | 'TRIM_FAILED'
  | 'SOURCE_TOO_SHORT'
  | 'PERMISSION_DENIED'
  | 'STORAGE_FAILED'
  | 'CLIP_NOT_FOUND'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(code: AppErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown, fallbackCode: AppErrorCode = 'UNKNOWN'): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(fallbackCode, error.message, error);
  }

  return new AppError(fallbackCode, 'Something went wrong.', error);
}

export function resolveErrorMessage(error: unknown): string {
  const appError = toAppError(error);

  switch (appError.code) {
    case 'TRIMMER_UNAVAILABLE':
      return 'Trimming needs the native module, which Expo Go does not ship. Run a development build to export clips.';
    case 'SOURCE_TOO_SHORT':
      return 'This video is shorter than five seconds. Pick a longer one.';
    case 'PERMISSION_DENIED':
      return 'FiveSec needs library access to pick a video.';
    case 'STORAGE_FAILED':
      return 'The clip could not be saved to device storage.';
    case 'CLIP_NOT_FOUND':
      return 'This clip is no longer available.';
    case 'TRIM_FAILED':
      return appError.message || 'The clip could not be exported.';
    default:
      return appError.message || 'Something went wrong.';
  }
}
