import { SmartTradeParams } from '3commas-typescript/dist/types/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { TwitterSignalEventDto } from 'src/core/db/firestore/repositories/marketplace/twitter-signal-events/dto/twitter-signal-event.dto';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import { TweetTradingBotDto } from './db/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';
import { TweetTradingDbService } from './db/tweet-trading-db.service';
import { fromSmartTradeSettingsToSmartTrade } from './utils/fromSmartTradeSettingsToSmartTrade';
import { matchSignalEventsForBotByWatchingIds } from './utils/matchSignalEventsForBotByWatchingIds';
import { TwitterSignalsService } from 'src/marketplace/twitter-signals/twitter-signals.service';
import { ThreeCommasApiService } from 'src/shared/3commas-api/3commas-api.service';

@Injectable()
export class TweetTradingService {
  constructor(
    private readonly twitterSignalsService: TwitterSignalsService,
    private readonly threeCommasApiService: ThreeCommasApiService,
    private readonly logger: Logger,
    private readonly db: TweetTradingDbService,
    private readonly firestore: FirestoreService,
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
  ) {}

  // Match signal events for every enabled bot,
  // and create a SmartTrade
  async runMatching() {
    const report: Array<{
      bot: TweetTradingBotDto;
      signalEvent: TwitterSignalEventDto;
    }> = [];

    this.logger.debug(`Retrieving active signal events...`);
    const activeSignalEvents =
      await this.twitterSignalsService.activeSignalEvents();

    this.logger.debug(
      `Active signal events count: ${activeSignalEvents.length}`,
    );

    if (activeSignalEvents.length === 0) {
      this.logger.debug('No signal events. Skip process.');
      return report;
    }

    this.logger.debug('Retrieving active TweetTradingBots...');
    const activeBots = await this.db.bots.findAllEnabled();

    this.logger.debug(`Enabled bots count: ${activeBots.length}`);

    if (activeBots.length === 0) {
      this.logger.debug('No active bots. Skip process.');
      return report;
    }

    for (const bot of activeBots) {
      const matchedSignalEvents = matchSignalEventsForBotByWatchingIds(
        bot,
        activeSignalEvents,
      );
      this.logger.debug(
        `Matched signal events count: ${matchedSignalEvents.length}`,
      );

      if (matchedSignalEvents.length === 0) {
        this.logger.debug('No matched signal events. Skip process.');
        return report;
      }

      // need a solution for multiple matched signal events
      // for MVP just use the first signal event
      const signalEvent = matchedSignalEvents[0];
      this.logger.debug(`Signal ${signalEvent.signalId} event matched`, {
        signalEvent,
      });

      // Check if signal was already used before
      const wasSignalUsedBefore = bot.usedSignalEventsIds.includes(
        signalEvent.id,
      );
      if (wasSignalUsedBefore) {
        this.logger.debug(
          `Signal ${signalEvent.signalId} eventId ${signalEvent.id} was already used before in another SmartTrade. Skip process.`,
          {
            signalEvent,
            usedSignalEventsIds: bot.usedSignalEventsIds,
          },
        );
        return report;
      }

      const newUsedSignalEvents: string[] = [
        ...bot.usedSignalEventsIds,
        signalEvent.id,
      ];
      this.logger.debug(`Update bot.usedSignalEvents of bot ${bot.id}`, {
        usedSignalEvents: newUsedSignalEvents,
      });

      const savedBot = await this.db.bots.updateUsedSignalEvents(
        newUsedSignalEvents,
        bot,
      );
      this.logger.debug(`Bot ${bot.id} updated`, {
        bot: savedBot,
      });

      // Save report
      report.push({
        bot: savedBot,
        signalEvent,
      });

      this.logger.debug(
        `Creating smart trade for pair ${bot.smartTradeSettings.baseCurrency}/${bot.smartTradeSettings.quoteCurrency} ...`,
      );
      await this.createSmartTradeFromSignalEvent(signalEvent, savedBot);
      this.logger.debug('Creating smart trade...');
    }

    this.logger.debug('Matched successfully');

    return report;
  }

  async createSmartTradeFromSignalEvent(
    signalEvent: TwitterSignalEventDto,
    bot: TweetTradingBotDto,
  ): Promise<void> {
    const currentAssetPrice = await this.getCurrentAssetPrice(
      bot.smartTradeSettings.baseCurrency,
      bot.smartTradeSettings.quoteCurrency,
    );

    const smartTradeParams: SmartTradeParams =
      fromSmartTradeSettingsToSmartTrade(
        bot.smartTradeSettings,
        currentAssetPrice,
      );
    this.logger.debug(`Creating SmartTrade`, {
      smartTradeParams,
    });

    const smartTrade =
      await this.threeCommasApiService.smartTrades.createSmartTrade(
        smartTradeParams,
      );

    this.logger.debug(`Smart trade created successfully`, {
      smartTrade,
    });
  }

  private async getCurrentAssetPrice(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<number> {
    // accountId is harcoded
    // need to find better solution
    // refactor needed
    const exchangeAccount = await this.firestore.exchangeAccount.findOne(
      'okx_real_testing',
    );

    const exchangeService =
      this.exchangeFactory.createFromExchangeAccount(exchangeAccount);

    const marketPrice = await exchangeService.getMarketPrice({
      symbol: `${baseCurrency}-${quoteCurrency}`,
    });

    return marketPrice.price;
  }
}
