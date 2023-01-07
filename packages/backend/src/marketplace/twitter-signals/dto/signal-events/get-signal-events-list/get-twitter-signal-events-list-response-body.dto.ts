import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';

export class GetTwitterSignalEventsListResponseBodyDto {
  signalEvents: TwitterSignalEventDto[];
}
