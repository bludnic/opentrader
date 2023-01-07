import { ITweetBrief } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/types/tweet/tweet-brief.interface';

export interface ITwitterSignalEvent {
  id: string; // SignalEvent id
  signalId: string;

  tweet: ITweetBrief;

  createdAt: number; // timestamp
}
