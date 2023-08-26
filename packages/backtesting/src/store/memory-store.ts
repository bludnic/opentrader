import {
  IStore,
  SmartTrade,
  UseSmartTradePayload,
} from "@bifrost/bot-processor";
import { SmartTradeTypeEnum } from "@bifrost/bot-processor";
import { OrderStatusEnum } from "@bifrost/types";
import { uniqueId } from "lodash";
import { MarketSimulator } from "../market-simulator";

export class MemoryStore implements IStore {
  /**
   * @internal
   */
  constructor(private marketSimulator: MarketSimulator) {}

  /**
   * @internal
   */
  smartTradesMap: Record<string, string> = {}; // Record<smartTradeKey, smartTrade.id>

  /**
   * @internal
   */
  getSmartTrades() {
    const smartTradesIds = Object.values(this.smartTradesMap)

    const smartTrades = smartTradesIds.flatMap<SmartTrade>(smartTradeId => {
      const smartTrade = this.marketSimulator.smartTrades.find(smartTrade => smartTrade.id === smartTradeId)

      if (smartTrade) {
        return [smartTrade]
      }

      return []
    })

    return smartTrades
  }

  async stopBot() {
    return Promise.resolve();
  }

  async getSmartTrade(key: string, botId: string): Promise<SmartTrade | null> {
    const smartTradeId = this.smartTradesMap[key];

    if (smartTradeId) {
      const smartTrade = this.marketSimulator.smartTrades.find(
        (smartTrade) => smartTrade.id === smartTradeId
      );

      if (smartTrade) {
        return smartTrade;
      }
    }

    return null;
  }

  async createSmartTrade(
    key: string,
    payload: UseSmartTradePayload,
    botId: string
  ): Promise<SmartTrade> {
    console.log(`createSmartTrade with key ${key}`);
    const candlestick = this.marketSimulator.currentCandle;

    const docId = uniqueId("id_");
    const { buy, sell, quantity } = payload;
    const createdAt = candlestick.timestamp;

    let smartTrade: SmartTrade;
    if (buy && sell) {
      smartTrade = {
        id: docId,
        type: SmartTradeTypeEnum.BuySell,
        buy: {
          price: buy.price,
          status: buy.status || OrderStatusEnum.Idle,
          createdAt,
          updatedAt: createdAt,
        },
        sell: {
          price: sell.price,
          status: sell.status || OrderStatusEnum.Idle,
          createdAt,
          updatedAt: createdAt,
        },
        quantity,
      };
    } else if (buy) {
      smartTrade = {
        id: docId,
        type: SmartTradeTypeEnum.BuyOnly,
        buy: {
          price: buy.price,
          status: buy.status || OrderStatusEnum.Idle,
          createdAt,
          updatedAt: createdAt,
        },
        sell: null,
        quantity,
      };
    } else {
      smartTrade = {
        id: docId,
        type: SmartTradeTypeEnum.SellOnly,
        buy: null,
        sell: {
          price: sell.price,
          status: sell.status || OrderStatusEnum.Idle,
          createdAt,
          updatedAt: createdAt,
        },
        quantity,
      };
    }

    console.log("createSmartTrade: created", smartTrade);

    this.marketSimulator.smartTrades.push(smartTrade);
    this.smartTradesMap[key] = smartTrade.id;

    return smartTrade;
  }
}
