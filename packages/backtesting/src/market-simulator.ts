import type {
  LimitOrderFilled,
  MarketOrderFilled,
  SmartTrade,
} from "@opentrader/bot-processor";
import type { ICandlestick } from "@opentrader/types";
import { OrderStatusEnum } from "@opentrader/types";
import { format, logger } from "@opentrader/logger";

export class MarketSimulator {
  /**
   * Current candlestick
   */
  public candlestick: ICandlestick | null = null;
  public smartTrades: SmartTrade[] = [];

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

  editSmartTrade(newSmartTrade: SmartTrade, ref: string) {
    this.smartTrades = this.smartTrades.map((smartTrade) => {
      if (smartTrade.ref === ref) {
        return newSmartTrade;
      }

      return smartTrade;
    });
  }

  /**
   * Changes the order status from: `idle -> placed`
   * Return `true` if any order was placed
   */
  placeOrders() {
    return this.smartTrades
      .map((smartTrade) => this.placeOrder(smartTrade))
      .some((value) => value);
  }

  /**
   * Changed orders statuses from `placed -> filled`
   * Return `true` if any order was fulfilled
   */
  fulfillOrders(): boolean {
    return this.smartTrades
      .map((smartTrade) => this.fulfillOrder(smartTrade))
      .some((value) => value);
  }

  /**
   * Mark `idle` order as `placed`
   * @param smartTrade - SmartTrade
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
   * Update order statue to "Filled" based on current asset price:
   * - `placed -> filled`
   * @param smartTrade - SmartTrade
   * @returns Returns `true` if order was fulfilled
   */
  private fulfillOrder(smartTrade: SmartTrade): boolean {
    const candlestick = this.currentCandle;

    const updatedAt = candlestick.timestamp;

    if (smartTrade.buy && smartTrade.buy.status === OrderStatusEnum.Placed) {
      if (smartTrade.buy.type === "Market") {
        const filledOrder: MarketOrderFilled = {
          ...smartTrade.buy,
          status: OrderStatusEnum.Filled,
          filledPrice: candlestick.close,
          updatedAt,
        };
        smartTrade.buy = filledOrder;

        logger.info(
          `[MarketSimulator] Market BUY order was filled at ${filledOrder.filledPrice} on ${format.datetime(updatedAt)}`,
        );

        return true;
      } else if (smartTrade.buy.type === "Limit") {
        if (candlestick.close <= smartTrade.buy.price) {
          const filledOrder: LimitOrderFilled = {
            ...smartTrade.buy,
            status: OrderStatusEnum.Filled,
            filledPrice: smartTrade.buy.price,
            updatedAt,
          };
          smartTrade.buy = filledOrder;

          logger.info(
            `[MarketSimulator] Limit BUY order was filled at ${filledOrder.filledPrice} on ${format.datetime(updatedAt)}`,
          );
          return true;
        }
      }
    }

    if (smartTrade.sell && smartTrade.sell.status === OrderStatusEnum.Placed) {
      if (smartTrade.sell.type === "Market") {
        const filledOrder: MarketOrderFilled = {
          ...smartTrade.sell,
          status: OrderStatusEnum.Filled,
          filledPrice: candlestick.close,
          updatedAt,
        };
        smartTrade.sell = filledOrder;

        logger.info(
          `[MarketSimulator] Market SELL order was filled at ${filledOrder.filledPrice} on ${format.datetime(updatedAt)}`,
        );
        return true;
      } else if (smartTrade.sell.type === "Limit") {
        if (candlestick.close >= smartTrade.sell.price) {
          const filledOrder: LimitOrderFilled = {
            ...smartTrade.sell,
            status: OrderStatusEnum.Filled,
            filledPrice: smartTrade.sell.price,
            updatedAt,
          };

          smartTrade.sell = filledOrder;

          logger.info(
            `[MarketSimulator] Limit SELL order was filled at ${filledOrder.filledPrice} on ${format.datetime(updatedAt)}`,
          );
          return true;
        }
      }
    }

    return false;
  }
}
