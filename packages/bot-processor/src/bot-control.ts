import { OrderStatusEnum } from "@bifrost/types";
import { isSmartBuy, isSmartTrade } from "./utils";
import { UseSmartTradePayload } from "./effects/common/types/use-smart-trade-effect";
import { IBotConfiguration } from "./types/bot/bot-configuration.interface";
import { IBotControl } from "./types/bot/bot-control.interface";
import { SmartTrade } from "./types/smart-trade/smart-trade.type";
import { IStore } from "./types/store/store.interface";

export class BotControl<T extends IBotConfiguration> implements IBotControl<T> {
  constructor(public store: IStore, public bot: T) {}

  async stop() {
    return this.store.stopBot(this.bot.id);
  }

  async getSmartTrade(key: string) {
    return this.store.getSmartTrade(key, this.bot.id);
  }

  async createSmartTrade(key: string, payload: UseSmartTradePayload) {
    return this.store.createSmartTrade(key, payload, this.bot.id);
  }

  async getOrCreateSmartTrade(
    key: string,
    payload: UseSmartTradePayload
  ): Promise<SmartTrade> {
    const smartTrade = await this.store.getSmartTrade(key, this.bot.id);

    if (smartTrade) {
      return smartTrade;
    }

    return this.store.createSmartTrade(key, payload, this.bot.id);
  }

  async replaceSmartTrade(
    key: string,
    smartTrade: SmartTrade
  ): Promise<SmartTrade> {
    let payload: UseSmartTradePayload;

    if (isSmartTrade(smartTrade)) {
      payload = {
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
    } else if (isSmartBuy(smartTrade)) {
      payload = {
        buy: {
          price: smartTrade.buy.price,
          status: OrderStatusEnum.Idle,
        },
        sell: null,
        quantity: smartTrade.quantity,
      };
    } else {
      // smartSell
      payload = {
        buy: null,
        sell: {
          price: smartTrade.sell.price,
          status: OrderStatusEnum.Idle,
        },
        quantity: smartTrade.quantity,
      };
    }

    return this.store.createSmartTrade(key, payload, this.bot.id);
  }
}
