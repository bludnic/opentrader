import { OrderStatusEnum } from "@bifrost/types";
import { SmartTradeTypeEnum } from "../../../types";
import { UseSmartTradePayload } from "../../../effects/common/types/use-smart-trade-effect";
import { SmartTrade } from "../../../types/smart-trade/smart-trade.type";
import { IStore } from "../../../types/store/store.interface";
import { State } from "./types";

export class StateManagement implements IStore {
  private state: State;

  constructor() {
    this.state = {
      BOT1: {
        enabled: true,
        smartTrades: [],
      },
    };
  }

  async stopBot(botId: string) {
    this.state[botId].enabled = false;
  }

  async getSmartTrade(key: string, botId: string) {
    const smartTrade = this.state[botId].smartTrades.find(
      (smartTrade) => smartTrade.id === key
    );

    return smartTrade || null;
  }

  async createSmartTrade(
    key: string,
    payload: UseSmartTradePayload,
    botId: string
  ) {
    const { buy, sell, quantity } = payload;

    let smartTrade: SmartTrade;
    if (buy && sell) {
      smartTrade = {
        id: key,
        type: SmartTradeTypeEnum.BuySell,
        buy: {
          price: buy.price,
          status: buy.status || OrderStatusEnum.Idle,
          createdAt: 0,
          updatedAt: 0,
        },
        sell: {
          price: sell.price,
          status: sell.status || OrderStatusEnum.Idle,
          createdAt: 0,
          updatedAt: 0,
        },
        quantity,
      };
    } else if (buy) {
      smartTrade = {
        id: key,
        type: SmartTradeTypeEnum.BuyOnly,
        buy: {
          price: buy.price,
          status: buy.status || OrderStatusEnum.Idle,
          createdAt: 0,
          updatedAt: 0,
        },
        sell: null,
        quantity,
      };
    } else {
      smartTrade = {
        id: key,
        type: SmartTradeTypeEnum.SellOnly,
        buy: null,
        sell: {
          price: sell.price,
          status: sell.status || OrderStatusEnum.Idle,
          createdAt: 0,
          updatedAt: 0,
        },
        quantity,
      };
    }

    this.state[botId].smartTrades.push(smartTrade);

    return smartTrade;
  }
}
