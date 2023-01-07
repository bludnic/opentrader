import { TwitterSignalDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signals/dto/twitter-signal.dto';

export class GetTwitterSignalsListResponseBodyDto {
  signals: TwitterSignalDto[];
}
