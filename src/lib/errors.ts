export type AppErrorCode =
  | 'TRIMMER_UNAVAILABLE'
  | 'TRIM_FAILED'
  | 'SOURCE_TOO_SHORT'
  | 'PERMISSION_DENIED'
  | 'CAMERA_UNAVAILABLE'
  | 'STORAGE_FAILED'
  | 'CLIP_NOT_FOUND'
  | 'AI_NOT_CONFIGURED'
  | 'AI_FAILED'
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
      return 'Trimming runs in native code that Expo Go does not ship. Install a development or preview build to export clips.';
    case 'SOURCE_TOO_SHORT':
      return 'This video is shorter than five seconds. Pick a longer one.';
    case 'PERMISSION_DENIED':
      return 'FiveSec needs library access to pick a video.';
    case 'CAMERA_UNAVAILABLE':
      return 'No camera is available here. Simulators have none, so pick a video from the library instead.';
    case 'STORAGE_FAILED':
      return 'The clip could not be saved to device storage.';
    case 'CLIP_NOT_FOUND':
      return 'This clip is no longer available.';
    case 'AI_NOT_CONFIGURED':
      return 'AI suggestions are not configured for this build. The OpenAI key is read from the EAS environment variables.';
    case 'AI_FAILED':
      return appError.message || 'The suggestion could not be generated.';
    case 'TRIM_FAILED':
      return appError.message || 'The clip could not be exported.';
    default:
      return appError.message || 'Something went wrong.';
  }
}
