import { TweetTradingBotDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';
import { ITwitterSignalEvent } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/twitter-signal-event.interface';

/**
 * Find suitable signal based on bot baseCurrency/quoteCurrency settings.
 *
 * @param bot
 * @param signalEvents
 */
export function matchSignalEventsForBotByCoin(
  bot: TweetTradingBotDto,
  signalEvents: ITwitterSignalEvent[],
): ITwitterSignalEvent[] {
  const { smartTradeSettings } = bot;

  return signalEvents.filter((signalEvent) => {
    const coinMatch =
      smartTradeSettings.baseCurrency === signalEvent.coin.baseCurrency &&
      smartTradeSettings.quoteCurrency === signalEvent.coin.quoteCurrency;

    return coinMatch;
  });
}
