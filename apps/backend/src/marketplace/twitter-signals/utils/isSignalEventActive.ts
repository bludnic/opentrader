import { parseISO, differenceInMinutes } from 'date-fns';
import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import { utcDateNow } from './utcDateNow';

export const ACTIVE_SIGNAL_EVENT_MAX_MINUTES = 15; // max minutes signal event is active

export function isSignalEventActive(
  signalEvent: TwitterSignalEventDto,
): boolean {
  const tweetedAt = parseISO(signalEvent.tweet.created_at);
  const now = utcDateNow();

  const minutesPassed = differenceInMinutes(now, tweetedAt);

  return minutesPassed <= ACTIVE_SIGNAL_EVENT_MAX_MINUTES && minutesPassed > 0; // to be sure, signal can't be in the past, before tweet date
}
