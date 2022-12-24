import { customAlphabet } from 'nanoid';

const alphaNumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const nanoid = customAlphabet(alphaNumericAlphabet, 32);

export function generateUniqId(): string {
  return nanoid();
}
