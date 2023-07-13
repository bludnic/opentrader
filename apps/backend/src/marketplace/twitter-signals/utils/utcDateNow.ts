import { parseISO } from 'date-fns';
import { utcDateNowISO } from './utcDateNowISO';

export function utcDateNow(): Date {
  return parseISO(utcDateNowISO());
}
