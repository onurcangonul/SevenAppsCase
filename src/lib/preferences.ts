import { Storage } from 'expo-sqlite/kv-store';

export type PreferenceKey = 'onboarding.completed';

export function readFlag(key: PreferenceKey): boolean {
  try {
    return Storage.getItemSync(key) === 'true';
  } catch {
    return false;
  }
}

export function writeFlag(key: PreferenceKey, value: boolean): void {
  Storage.setItemAsync(key, String(value)).catch(() => undefined);
}
