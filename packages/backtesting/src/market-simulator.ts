import { SmartTrade, SmartTradeTypeEnum } from "@bifrost/bot-processor";
import { ICandlestick, OrderStatusEnum } from "@bifrost/types";

export class MarketSimulator {
  /**
   * Current candlestick
   */
  public candlestick: ICandlestick | null = null;
  public smartTrades: SmartTrade[] = [];

  constructor() {}

  get currentCandle(): ICandlestick {
    if (!this.candlestick) throw new Error("Data.candlestick is undefined");

    return this.candlestick;
  }

  nextCandle(candlestick: ICandlestick) {
    this.candlestick = candlestick;
  }

  /**
   * Changes the order status from: `idle` -> `placed`
   * Return `true` if any order was placed
   */
  placeOrders() {
    return this.smartTrades.some((smartTrade) => {
      return this.placeOrder(smartTrade.id);
    });
  }

  /**
   * Changed orders statuses from `placed` -> `filled`
   * Return `true` if any order was fulfilled
   */
  fulfillOrders(): boolean {
    return this.smartTrades.some((smartTrade) => {
      return this.fulfillOrder(smartTrade.id);
    });
  }

  /**
   * Mark `idle` order as `placed`
   * @param smartTradeId
   */
  private placeOrder(smartTradeId: string): boolean {
    const smartTrade = this.smartTrades.find(
      (smartTrade) => smartTrade.id === smartTradeId
    );

    if (!smartTrade)
      throw new Error(
        `Unexpected error: SmartTrade with ${smartTradeId} not found`
      );

    // Update orders statuses from Idle to Placed
    if (smartTrade.buy && smartTrade.buy.status === OrderStatusEnum.Idle) {
      smartTrade.buy = {
        ...smartTrade.buy,
        status: OrderStatusEnum.Placed,
      };

      return true
    } else if (
      smartTrade.sell &&
      smartTrade.sell.status === OrderStatusEnum.Idle &&
      (!smartTrade.buy || smartTrade.buy.status === OrderStatusEnum.Filled)
    ) {
      smartTrade.sell = {
        ...smartTrade.sell,
        status: OrderStatusEnum.Placed,
      };

      return true
    }

    return false
  }

  /**
   * Update order statue to Filled based on current asset price:
   * - `placed` -> `filled`
   * @param smartTradeId
   * @return Returns `true` if order was fulfilled
   */
  private fulfillOrder(smartTradeId: string): boolean {
    const candlestick = this.currentCandle;

    const smartTrade = this.smartTrades.find(
      (smartTrade) => smartTrade.id === smartTradeId
    );

    if (!smartTrade)
      throw new Error(
        `Unexpected error: SmartTrade with ${smartTradeId} not found`
      );

    const updatedAt = candlestick.timestamp;

    if (smartTrade.buy && smartTrade.buy.status === OrderStatusEnum.Placed) {
      if (candlestick.close <= smartTrade.buy.price) {
        smartTrade.buy = {
          ...smartTrade.buy,
          status: OrderStatusEnum.Filled,
          updatedAt,
        };
        console.log(
          `[TestingDb] ST# ${smartTrade.id} buy order filled, updated at ${updatedAt}`
        );
        console.log(smartTrade)
        return true
      }
    }

    if (smartTrade.sell && smartTrade.sell.status === OrderStatusEnum.Placed) {
      if (candlestick.close >= smartTrade.sell.price) {
        smartTrade.sell = {
          ...smartTrade.sell,
          status: OrderStatusEnum.Filled,
          updatedAt,
        };

        console.log(
          `[TestingDb] ST# ${smartTradeId} sell order filled, updated at ${updatedAt}`
        );
        console.log(smartTrade)
        return true
      }
    }

    return false
  }

  findChangedSmartTrades() {
    const candlestick = this.currentCandle;

    return this.smartTrades.filter(smartTrade => {
      if (smartTrade.type !== SmartTradeTypeEnum.BuySell) {
        console.log(`findChangedSmartTrades: smartTrade ${smartTrade.type} type is not supported`)
        return false
      }

      return smartTrade.buy.updatedAt === candlestick.timestamp ||
        smartTrade.sell && smartTrade.sell.updatedAt === candlestick.timestamp
    })
  }
}
