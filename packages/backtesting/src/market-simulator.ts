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
   * Process orders.
   * Change status from:
   * - `idle` -> `placed`
   * - `placed` -> `filled` (based on current asset price)
   */
  processOrders() {
    this.placeOrders();
    this.fulfillOrders();
  }

  private placeOrders() {
    this.smartTrades.forEach((smartTrade) => {
      this.placeOrder(smartTrade.id);
    });
  }

  private fulfillOrders() {
    this.smartTrades.forEach((smartTrade) => {
      this.fulfillOrder(smartTrade.id);
    });
  }

  /**
   * Mark `idle` orders as `placed`
   * @param smartTradeId
   */
  private placeOrder(smartTradeId: string) {
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
    } else if (
      smartTrade.sell &&
      smartTrade.sell.status === OrderStatusEnum.Idle &&
      (!smartTrade.buy || smartTrade.buy.status === OrderStatusEnum.Filled)
    ) {
      smartTrade.sell = {
        ...smartTrade.sell,
        status: OrderStatusEnum.Placed,
      };
    }
  }

  /**
   * Update order statue to Filled based on current asset price
   * @param smartTradeId
   */
  private fulfillOrder(smartTradeId: string) {
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
      }
    }
  }
}
