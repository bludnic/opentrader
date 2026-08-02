/**
 * At-rest encryption for exchange account credentials (apiKey, secretKey, password).
 *
 * OpenTrader historically stored these fields as plaintext in the database. This module
 * encrypts them with AES-256-GCM before they hit the DB and decrypts them transparently
 * on the way out, via the `xprisma` query extension (see xprisma.ts). The encryption key
 * is kept in a separate file from the database itself, so a leaked DB file/backup alone
 * is not enough to recover the credentials.
 */
import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

const ALGORITHM = "aes-256-gcm";
// Kept independent from app/src/utils/app-path.ts (".opentrader") on purpose — packages/db
// must not reach into the app package across workspace boundaries. Same directory, resolved locally.
const KEY_PATH = join(homedir(), ".opentrader", "credentials.key");
const IV_LENGTH = 12; // recommended IV length for GCM
const ENC_PREFIX = "enc:v1:"; // lets us tell already-encrypted values apart from legacy plaintext

function loadOrCreateKey(): Buffer {
  const fromEnv = process.env.CREDENTIALS_ENCRYPTION_KEY;
  if (fromEnv) {
    const key = Buffer.from(fromEnv, "hex");
    if (key.length !== 32) {
      throw new Error("CREDENTIALS_ENCRYPTION_KEY must be a 64-character hex string (32 bytes).");
    }
    return key;
  }

  if (existsSync(KEY_PATH)) {
    return Buffer.from(readFileSync(KEY_PATH, "utf8").trim(), "hex");
  }

  const key = randomBytes(32);
  mkdirSync(dirname(KEY_PATH), { recursive: true });
  writeFileSync(KEY_PATH, key.toString("hex"), { mode: 0o600 });
  // eslint-disable-next-line no-console
  console.warn(
    `[opentrader] Generated a new credentials encryption key at ${KEY_PATH}. ` +
      "Back this file up separately from the database — losing it makes stored exchange " +
      "credentials unrecoverable, and anyone who obtains a copy of it plus your DB file can " +
      "decrypt your API keys.",
  );
  return key;
}

let cachedKey: Buffer | null = null;
function getKey(): Buffer {
  if (!cachedKey) cachedKey = loadOrCreateKey();
  return cachedKey;
}

export function encryptSecret(plaintext: string): string {
  if (plaintext.startsWith(ENC_PREFIX)) return plaintext; // already encrypted, avoid double-wrapping
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return ENC_PREFIX + Buffer.concat([iv, authTag, ciphertext]).toString("base64");
}

export function decryptSecret(value: string): string {
  if (!value.startsWith(ENC_PREFIX)) return value; // legacy plaintext row, hand back as-is
  const raw = Buffer.from(value.slice(ENC_PREFIX.length), "base64");
  const iv = raw.subarray(0, IV_LENGTH);
  const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + 16);
  const ciphertext = raw.subarray(IV_LENGTH + 16);
  const decipher = createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

const CREDENTIAL_FIELDS = ["apiKey", "secretKey", "password"] as const;

export function encryptExchangeAccountFields<T extends Record<string, unknown>>(data: T): T {
  for (const field of CREDENTIAL_FIELDS) {
    const value = data[field];
    if (typeof value === "string" && value.length > 0) {
      (data as Record<string, unknown>)[field] = encryptSecret(value);
    }
  }
  return data;
}

export function decryptExchangeAccountRow<T extends Record<string, unknown>>(row: T): T {
  for (const field of CREDENTIAL_FIELDS) {
    const value = row[field];
    if (typeof value === "string" && value.length > 0) {
      (row as Record<string, unknown>)[field] = decryptSecret(value);
    }
  }
  return row;
}
