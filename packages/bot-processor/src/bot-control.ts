import { OrderStatusEnum } from "@opentrader/types";
import { UseSmartTradePayload } from "./effects/common/types/use-smart-trade-effect";
import { IBotConfiguration } from "./types/bot/bot-configuration.interface";
import { IBotControl } from "./types/bot/bot-control.interface";
import { SmartTrade } from "./types/smart-trade/smart-trade.type";
import { IStore } from "./types/store/store.interface";

export class BotControl<T extends IBotConfiguration> implements IBotControl<T> {
  constructor(
    public store: IStore,
    public bot: T,
  ) {}

  async stop() {
    return this.store.stopBot(this.bot.id);
  }

  async getSmartTrade(ref: string) {
    return this.store.getSmartTrade(ref, this.bot.id);
  }

  async createSmartTrade(ref: string, payload: UseSmartTradePayload) {
    return this.store.createSmartTrade(ref, payload, this.bot.id);
  }

  async getOrCreateSmartTrade(
    ref: string,
    payload: UseSmartTradePayload,
  ): Promise<SmartTrade> {
    const smartTrade = await this.store.getSmartTrade(ref, this.bot.id);

    if (smartTrade) {
      return smartTrade;
    }

    return this.store.createSmartTrade(ref, payload, this.bot.id);
  }

  async replaceSmartTrade(
    ref: string,
    smartTrade: SmartTrade,
  ): Promise<SmartTrade> {
    const payload: UseSmartTradePayload = {
      buy: {
        price: smartTrade.buy.price,
        status: OrderStatusEnum.Idle,
      },
      sell: {
        price: smartTrade.sell.price,
        status: OrderStatusEnum.Idle,
      },
      quantity: smartTrade.quantity,
    };

    return this.store.createSmartTrade(ref, payload, this.bot.id);
  }

  async cancelSmartTrade(ref: string) {
    return this.store.cancelSmartTrade(ref, this.bot.id);
  }
}
