import { TweetTradingBotDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';
import { ITwitterSignalEvent } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/twitter-signal-event.interface';

/**
 * Find suitable signal based on bot settings.
 *
 * @param bot
 * @param signalEvents
 */
export function matchSignalEventsForBotByWatchingIds(
  bot: TweetTradingBotDto,
  signalEvents: ITwitterSignalEvent[],
): ITwitterSignalEvent[] {
  return signalEvents.filter((signalEvent) => {
    const signalIncludedInWatchList = bot.watchSignalsIds.includes(
      signalEvent.signalId,
    );

    return signalIncludedInWatchList;
  });
}
