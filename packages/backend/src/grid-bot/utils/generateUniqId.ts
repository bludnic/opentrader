import { customAlphabet } from 'nanoid';

const alphaNumericAlphabet = '0123456789ABCDEF';

const nanoid = customAlphabet(alphaNumericAlphabet, 9);

export function generateUniqId(): string {
  return nanoid();
}
