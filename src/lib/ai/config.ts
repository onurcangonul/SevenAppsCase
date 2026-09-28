export const OPENAI_MODEL = 'gpt-4.1-mini';

export const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';

export const openAiApiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY?.trim() ?? '';

export const isAiConfigured = openAiApiKey.length > 0;
