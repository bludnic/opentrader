import { OrderStatusEnum } from "@opentrader/types";
import type { UseSmartTradePayload } from "./effects/index.js";
import type {
  IBotConfiguration,
  IBotControl,
  SmartTrade,
  IStore,
} from "./types/index.js";

export class BotControl<T extends IBotConfiguration> implements IBotControl {
  constructor(
    private store: IStore,
    private bot: T,
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

  async updateSmartTrade(
    ref: string,
    payload: Pick<UseSmartTradePayload, "sell">,
  ) {
    return this.store.updateSmartTrade(ref, payload, this.bot.id);
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
        type: smartTrade.buy.type,
        price: smartTrade.buy.price,
        status: OrderStatusEnum.Idle,
      },
      sell: smartTrade.sell
        ? {
            type: smartTrade.sell.type,
            price: smartTrade.sell.price,
            status: OrderStatusEnum.Idle,
          }
        : undefined,
      quantity: smartTrade.quantity,
    };

    return this.store.createSmartTrade(ref, payload, this.bot.id);
  }

  async cancelSmartTrade(ref: string) {
    return this.store.cancelSmartTrade(ref, this.bot.id);
  }

  async getExchange(label: string) {
    return this.store.getExchange(label);
  }
}
