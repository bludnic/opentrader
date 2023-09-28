import { SmartTrade } from "@bifrost/bot-processor";
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
   * @internal
   */
  addSmartTrade(smartTrade: SmartTrade, ref: string) {
    // remove existing refs to avoid duplicates
    this.smartTrades = this.smartTrades.map((smartTrade) => {
      if (smartTrade.ref === ref) {
        return {
          ...smartTrade,
          ref: "",
        };
      }

      return smartTrade;
    });

    this.smartTrades.push(smartTrade);
  }

  /**
   * Changes the order status from: `idle` -> `placed`
   * Return `true` if any order was placed
   */
  placeOrders() {
    return this.smartTrades
      .map((smartTrade) => this.placeOrder(smartTrade))
      .some((value) => value);
  }

  /**
   * Changed orders statuses from `placed` -> `filled`
   * Return `true` if any order was fulfilled
   */
  fulfillOrders(): boolean {
    return this.smartTrades
      .map((smartTrade) => this.fulfillOrder(smartTrade))
      .some((value) => value);
  }

  /**
   * Mark `idle` order as `placed`
   * @param smartTrade
   */
  private placeOrder(smartTrade: SmartTrade): boolean {
    // Update orders statuses from Idle to Placed
    if (smartTrade.buy && smartTrade.buy.status === OrderStatusEnum.Idle) {
      smartTrade.buy = {
        ...smartTrade.buy,
        status: OrderStatusEnum.Placed,
      };

      return true;
    } else if (
      smartTrade.sell &&
      smartTrade.sell.status === OrderStatusEnum.Idle &&
      (!smartTrade.buy || smartTrade.buy.status === OrderStatusEnum.Filled)
    ) {
      smartTrade.sell = {
        ...smartTrade.sell,
        status: OrderStatusEnum.Placed,
      };

      return true;
    }

    return false;
  }

  /**
   * Update order statue to Filled based on current asset price:
   * - `placed` -> `filled`
   * @return Returns `true` if order was fulfilled
   * @param smartTrade
   */
  private fulfillOrder(smartTrade: SmartTrade): boolean {
    const candlestick = this.currentCandle;

    const updatedAt = candlestick.timestamp;

    if (smartTrade.buy && smartTrade.buy.status === OrderStatusEnum.Placed) {
      if (candlestick.close <= smartTrade.buy.price) {
        smartTrade.buy = {
          ...smartTrade.buy,
          status: OrderStatusEnum.Filled,
          updatedAt,
        };
        console.log(
          `[TestingDb] ST# ${smartTrade.id} buy order filled, updated at ${updatedAt}`,
        );
        console.log(smartTrade);
        return true;
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
          `[TestingDb] ST# ${smartTrade.id} sell order filled, updated at ${updatedAt}`,
        );
        console.log(smartTrade);
        return true;
      }
    }

    return false;
  }
}
