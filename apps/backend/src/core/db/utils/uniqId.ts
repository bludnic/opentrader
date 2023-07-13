import { customAlphabet } from 'nanoid';

const alphaNumericAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-';

const nanoid = customAlphabet(alphaNumericAlphabet, 11);

export function uniqId(): string {
  return nanoid();
}
