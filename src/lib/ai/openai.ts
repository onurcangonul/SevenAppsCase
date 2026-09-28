import { AppError } from '../errors';
import { OPENAI_CHAT_URL, OPENAI_MODEL, openAiApiKey } from './config';

type TextPart = {
  type: 'text';
  text: string;
};

type ImagePart = {
  type: 'image_url';
  image_url: { url: string; detail: 'low' | 'high' | 'auto' };
};

export type ChatMessage =
  | { role: 'system'; content: string }
  | { role: 'user'; content: string | (TextPart | ImagePart)[] };

type StructuredCompletionRequest = {
  messages: ChatMessage[];
  schemaName: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
};

type ChatCompletionPayload = {
  choices?: { message?: { content?: string | null; refusal?: string | null } }[];
  error?: { message?: string };
};

function failureMessage(status: number, payload: ChatCompletionPayload | null): string {
  if (status === 401) {
    return 'OpenAI rejected the API key.';
  }

  if (status === 429) {
    return 'OpenAI rate limit or quota reached. Try again in a moment.';
  }

  return payload?.error?.message ?? `OpenAI responded with status ${status}.`;
}

export async function requestStructuredCompletion({
  messages,
  schemaName,
  schema,
  maxTokens = 400,
}: StructuredCompletionRequest): Promise<unknown> {
  if (!openAiApiKey) {
    throw new AppError('AI_NOT_CONFIGURED', 'No OpenAI API key is configured.');
  }

  let response: Response;

  try {
    response = await fetch(OPENAI_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages,
        max_completion_tokens: maxTokens,
        response_format: {
          type: 'json_schema',
          json_schema: { name: schemaName, strict: true, schema },
        },
      }),
    });
  } catch (error) {
    throw new AppError('AI_FAILED', 'Could not reach OpenAI. Check the connection.', error);
  }

  const payload = (await response.json().catch(() => null)) as ChatCompletionPayload | null;

  if (!response.ok) {
    throw new AppError('AI_FAILED', failureMessage(response.status, payload));
  }

  const message = payload?.choices?.[0]?.message;

  if (message?.refusal) {
    throw new AppError('AI_FAILED', message.refusal);
  }

  if (!message?.content) {
    throw new AppError('AI_FAILED', 'OpenAI returned an empty response.');
  }

  try {
    return JSON.parse(message.content);
  } catch (error) {
    throw new AppError('AI_FAILED', 'OpenAI returned malformed JSON.', error);
  }
}
