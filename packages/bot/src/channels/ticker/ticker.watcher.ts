import { EventEmitter } from "node:events";
import { ExchangeClosedByUser, NetworkError, RequestTimeout } from "ccxt";
import { type IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";

/**
 * Watcher for ticker on specific symbol.
 *
 * Emits:
 * - ticker: `ITicker`
 */
export class TickerWatcher extends EventEmitter {
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
      logger.warn(`[TickerWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} is already enabled`);
      return;
    }

    this.enabled = true;
    logger.info(`[TickerWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} was enabled`);
    void this.watch();
  }

  disable() {
    this.enabled = false;
  }

  /**
   * Watch ticker on specific symbol.
   */
  private async watch() {
    while (this.enabled) {
      try {
        const ticker = await this.exchange.watchTicker(this.symbol);
        logger.debug(
          ticker,
          `TickerWatcher: Received ticker with bid ${ticker.bid} and ask ${ticker.ask} for ${this.exchange.exchangeCode}:${this.symbol}`,
        );

        this.emit("ticker", ticker);
      } catch (err) {
        if (err instanceof NetworkError) {
          logger.warn(
            `[TickerWatcher] NetworkError occurred on ${this.exchange.exchangeCode}:${this.symbol}. Error: ${err.message}. Reconnecting in 3s...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 3000)); // prevents infinite cycle
        } else if (err instanceof RequestTimeout) {
          logger.warn(err, `[TickerWatcher] RequestTimeout occurred on ${this.exchange.exchangeCode}:${this.symbol}.`);
        } else if (err instanceof ExchangeClosedByUser) {
          // This is an expected error when shutting down the daemon by running disable() method
          logger.info("[TickerWatcher] ExchangeClosedByUser");
          break; // is it necessary, when `this.enabled` is already `false`?
        } else {
          logger.error(
            err,
            `[TickerWatcher] Unhandled error occurred on ${this.exchange.exchangeCode}:${this.symbol}. Watcher stopped.`,
          );
          this.disable();
          break;
        }
      }
    }
  }
}
