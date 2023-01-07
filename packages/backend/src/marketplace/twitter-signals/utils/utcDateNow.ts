import { parseISO } from 'date-fns';

export function utcDateNow(): Date {
  return parseISO(new Date().toISOString());
}
