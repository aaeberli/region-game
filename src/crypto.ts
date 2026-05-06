/**
 * Obfuscate a prize index using a session-only key stored in sessionStorage.
 * The key never touches localStorage — it only lives for the current tab session.
 * This is a UX deterrent against casual localStorage inspection, not cryptographic security.
 */

const SESSION_KEY_NAME = 'ptg_session_key';

function getOrCreateSessionKey(): Uint8Array {
  const stored = sessionStorage.getItem(SESSION_KEY_NAME);
  if (stored) {
    return new Uint8Array(JSON.parse(stored) as number[]);
  }
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  sessionStorage.setItem(SESSION_KEY_NAME, JSON.stringify(Array.from(key)));
  return key;
}

export function obfuscatePrizeIndex(prizeIndex: number): string {
  const key = getOrCreateSessionKey();
  // Encode prize index as a single byte XOR'd with key[0]
  const obfuscated = (prizeIndex & 0xff) ^ key[0];
  return obfuscated.toString(16).padStart(2, '0');
}

export function deobfuscatePrizeIndex(token: string): number {
  const key = getOrCreateSessionKey();
  const obfuscated = parseInt(token, 16);
  return (obfuscated ^ key[0]) & 0xff;
}

/**
 * Cryptographically secure Fisher-Yates shuffle using crypto.getRandomValues.
 */
export function secureShuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Hash a password with SHA-256, returns lowercase hex string.
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
