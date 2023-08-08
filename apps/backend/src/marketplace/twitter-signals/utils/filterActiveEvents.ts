import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import { isSignalEventActive } from './isSignalEventActive';

/**
 * Returns active signal events only.
 */
export function filterActiveEvents(
  signalEvents: TwitterSignalEventDto[],
): TwitterSignalEventDto[] {
  return signalEvents.filter(isSignalEventActive);
}
