import { EventEmitter } from "node:events";
import { ExchangeClosedByUser, NetworkError, RequestTimeout } from "ccxt";
import { type IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";

/**
 * Watcher for public trades on specific symbol.
 *
 * Emits:
 * - trade: `ITrade`
 */
export class TradesWatcher extends EventEmitter {
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
      logger.warn(`[TradesWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} is already enabled`);
      return;
    }

    this.enabled = true;
    logger.info(`[TradesWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} was enabled`);
    void this.watch();
  }

  disable() {
    this.enabled = false;
  }

  /**
   * Watch trades on specific symbol.
   */
  private async watch() {
    while (this.enabled) {
      try {
        const trades = await this.exchange.watchTrades({
          symbol: this.symbol,
        });
        logger.debug(
          trades,
          `TradesWatched: Received ${trades.length} trades for ${this.exchange.exchangeCode}:${this.symbol}`,
        );

        for (const trade of trades) {
          this.emit("trade", trade);
        }
      } catch (err) {
        if (err instanceof NetworkError) {
          logger.warn(
            `[TradesWatcher] NetworkError occurred on ${this.exchange.exchangeCode}:${this.symbol}. Error: ${err.message}. Reconnecting in 3s...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 3000)); // prevents infinite cycle
        } else if (err instanceof RequestTimeout) {
          logger.warn(err, `[TradesWatcher] RequestTimeout occurred on ${this.exchange.exchangeCode}:${this.symbol}.`);
        } else if (err instanceof ExchangeClosedByUser) {
          // This is an expected error when shutting down the daemon by running disable() method
          logger.info("[TradesWatcher] ExchangeClosedByUser");
          break; // is it necessary, when `this.enabled` is already `false`?
        } else {
          logger.error(
            err,
            `[TradesWatcher] Unhandled error occurred on ${this.exchange.exchangeCode}:${this.symbol}. Watcher stopped.`,
          );
          this.disable();
          break;
        }
      }
    }
  }
}
