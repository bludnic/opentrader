import { ITweetCoin } from 'src/core/db/types/entities/marketplace/twitter-signals/common/types/tweet-coin.interface';
import { ITweetBrief } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/types/tweet/tweet-brief.interface';

export interface ITwitterSignalEvent {
  id: string; // SignalEvent id
  signalId: string;

  tweet: ITweetBrief;

  coin: ITweetCoin;

  parsedAt: string; // ISO
}
