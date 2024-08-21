/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */

import { TBotWithExchangeAccount, xprisma } from "@opentrader/db";
import { BotState } from "@opentrader/bot-processor";
import { MarketData, MarketEvent, MarketId, MarketEventType } from "@opentrader/types";
import { eventBus } from "@opentrader/event-bus";

type BotId = number;

export class BotStore {
  unsubscribeFromEventBus?: () => void;

  bots: TBotWithExchangeAccount[] = [];
  state: Record<BotId, BotState> = {};
  processing: Record<BotId, boolean> = {};
  markets: Record<MarketId, MarketData> = {};

  constructor() {}

  async init() {
    await this.pullBots();

    this.unsubscribeFromEventBus = this.subcribeToEventBus();
  }

  destroy() {
    this.unsubscribeFromEventBus?.();
    console.log("BotStore destroyed");
  }

  private subcribeToEventBus() {
    const onBotStarted = (bot: TBotWithExchangeAccount) => {
      console.log("Bot started");
      this.bots = [...this.bots, bot];
    };
    eventBus.on("onBotStarted", onBotStarted);

    const onBotStopped = (bot: TBotWithExchangeAccount) => {
      console.log("Bot stopped");
      this.bots = this.bots.filter((b) => b.id !== bot.id);
    };
    eventBus.on("onBotStopped", onBotStopped);

    return () => {
      eventBus.off("onBotStarted", onBotStarted);
      eventBus.off("onBotStopped", onBotStopped);
    };
  }

  private async pullBots() {
    this.bots = await xprisma.bot.custom.findMany({
      where: { enabled: true },
      include: { exchangeAccount: true },
    });
  }

  getState(botId: number) {
    return this.state[botId] || {};
  }

  setState(botId: number, state: BotState) {
    this.state[botId] = state;
  }

  isProcessing(botId: number) {
    return this.processing[botId] ?? false;
  }

  setProcessing(botId: number, value: boolean) {
    this.processing[botId] = value;
  }

  /**
   * Returns filtered markets for specific bot.
   */
  getMarkets(marketIds: MarketId[]) {
    return marketIds
      .filter((marketId) => this.markets[marketId])
      .map((marketId) => [marketId, this.markets[marketId]] as const)
      .reduce(
        (acc, [marketId, market]) => {
          acc[marketId] = market;
          return acc;
        },
        {} as Record<MarketId, MarketData>,
      );
  }

  getMarket(marketId: MarketId): MarketData | undefined {
    return this.markets[marketId];
  }

  updateMarket(data: MarketEvent) {
    const { marketId } = data;

    // Create market if does not exist
    if (!this.markets[marketId]) {
      this.markets[marketId] = {
        candles: [],
      };
    }

    switch (data.type) {
      case MarketEventType.onCandleClosed:
        this.markets[marketId].candle = data.candle;
        this.markets[marketId].candles = data.candles;
        break;
      case MarketEventType.onOrderbookChange:
        this.markets[marketId].orderbook = data.orderbook;
        break;
      case MarketEventType.onTickerChange:
        this.markets[marketId].ticker = data.ticker;
        break;
      case MarketEventType.onPublicTrade:
        this.markets[marketId].trade = data.trade;
        break;
      default:
        console.error("Unrecognized event type", data);
        break;
    }
  }
}

export const store = new BotStore();
