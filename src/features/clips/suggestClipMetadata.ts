import { z } from 'zod';

import { CLIP_DURATION_MS, DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@/constants/clip';
import { requestStructuredCompletion } from '@/lib/ai/openai';
import { AppError } from '@/lib/errors';
import { captureFrames } from '@/lib/media/frames';
import type { ClipMetadata } from '@/types/clip';

const FRAME_COUNT = 4;
const FRAME_MAX_SIZE = 512;

export type SuggestionSource = {
  uri: string;
  startMs: number;
};

const suggestionSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const suggestionJsonSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: `Short, specific title in title case, at most ${NAME_MAX_LENGTH} characters.`,
    },
    description: {
      type: 'string',
      description: `One or two sentences, at most ${DESCRIPTION_MAX_LENGTH} characters.`,
    },
  },
  required: ['name', 'description'],
  additionalProperties: false,
};

const instructions = [
  'You write entries for a video diary in which every clip is exactly five seconds long.',
  'You receive frames sampled in order from a single clip.',
  `Give it a short, specific name of at most ${NAME_MAX_LENGTH} characters, without quotes or emoji.`,
  `Describe the moment in one or two sentences of at most ${DESCRIPTION_MAX_LENGTH} characters, written like a personal diary note.`,
  'Describe only what is visible. Never guess who people are or where the clip was filmed.',
  'Write in English.',
].join(' ');

function clamp(value: string, max: number): string {
  const trimmed = value.trim();

  return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

async function readFrames({ uri, startMs }: SuggestionSource): Promise<string[]> {
  try {
    return await captureFrames(uri, {
      startMs,
      durationMs: CLIP_DURATION_MS,
      count: FRAME_COUNT,
      maxSize: FRAME_MAX_SIZE,
    });
  } catch (error) {
    throw new AppError('AI_FAILED', 'Could not read frames from this video.', error);
  }
}

export async function suggestClipMetadata(source: SuggestionSource): Promise<ClipMetadata> {
  const frames = await readFrames(source);

  const raw = await requestStructuredCompletion({
    schemaName: 'clip_metadata',
    schema: suggestionJsonSchema,
    messages: [
      { role: 'system', content: instructions },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `These ${frames.length} frames cover the five seconds from start to end.`,
          },
          ...frames.map((frame) => ({
            type: 'image_url' as const,
            image_url: { url: `data:image/jpeg;base64,${frame}`, detail: 'low' as const },
          })),
        ],
      },
    ],
  });

  const parsed = suggestionSchema.safeParse(raw);

  if (!parsed.success) {
    throw new AppError('AI_FAILED', 'OpenAI returned a suggestion in an unexpected shape.');
  }

  return {
    name: clamp(parsed.data.name, NAME_MAX_LENGTH),
    description: clamp(parsed.data.description, DESCRIPTION_MAX_LENGTH),
  };
}
