import { EventEmitter } from "node:events";
import { ExchangeClosedByUser, NetworkError, RequestTimeout } from "ccxt";
import { type IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";

/**
 * Watcher for orderbook changes on specific symbol.
 *
 * Emits:
 * - orderbook: `IOrderbook`
 */
export class OrderbookWatcher extends EventEmitter {
  public symbol: string;
  private exchange: IExchange;
  private enabled = false;

  constructor(symbol: string, exchange: IExchange) {
    super();
    this.symbol = symbol;
    this.exchange = exchange;
  }

  enable() {
    if (this.enabled) {
      logger.warn(`[OrderbookWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} is already enabled`);
      return;
    }

    this.enabled = true;
    logger.info(`[OrderbookWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} was enabled`);
    void this.watch();
  }

  disable() {
    this.enabled = false;
  }

  /**
   * Watch orderbook on specific symbol.
   */
  private async watch() {
    while (this.enabled) {
      try {
        const orderbook = await this.exchange.watchOrderbook(this.symbol);
        logger.debug(
          orderbook,
          `OrderbookWatcher: Received ${orderbook.asks.length} ASKs and ${orderbook.bids.length} BIDs for ${this.exchange.exchangeCode}:${this.symbol}`,
        );

        this.emit("orderbook", orderbook);
      } catch (err) {
        if (err instanceof NetworkError) {
          logger.warn(
            `[OrderbookWatcher] NetworkError occurred on ${this.exchange.exchangeCode}:${this.symbol}. Error: ${err.message}. Reconnecting in 3s...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 3000)); // prevents infinite cycle
        } else if (err instanceof RequestTimeout) {
          logger.warn(
            err,
            `[OrderbookWatcher] RequestTimeout occurred on ${this.exchange.exchangeCode}:${this.symbol}.`,
          );
        } else if (err instanceof ExchangeClosedByUser) {
          // This is an expected error when shutting down the daemon by running disable() method
          logger.info("[OrderbookWatcher] ExchangeClosedByUser");
          break; // is it necessary, when `this.enabled` is already `false`?
        } else {
          logger.error(
            err,
            `[OrderbookWatcher] Unhandled error occurred on ${this.exchange.exchangeCode}:${this.symbol}. Watcher stopped.`,
          );
          this.disable();
          break;
        }
      }
    }
  }
}
