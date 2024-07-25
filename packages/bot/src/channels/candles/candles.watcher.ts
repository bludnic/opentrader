import { EventEmitter } from "node:events";
import { NetworkError, RequestTimeout } from "ccxt";
import { type IExchange } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";

/**
 * Watcher that subscribes to 1m candles on specific symbol.
 *
 * Emits:
 * - candle: `ICandlestick`
 */
export class CandlesWatcher extends EventEmitter {
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
      logger.warn(`[CandlesWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} is already enabled`);
      return;
    }

    this.enabled = true;
    logger.info(`[CandlesWatcher] Watcher on ${this.exchange.exchangeCode}:${this.symbol} was enabled`);
    void this.watch();
  }

  disable() {
    this.enabled = false;
  }

  /**
   * Watch candles on specific symbol.
   */
  private async watch() {
    while (this.enabled) {
      try {
        const candles = await this.exchange.watchCandles({
          symbol: this.symbol,
        });
        logger.debug(
          candles,
          `CandlesWatcher: Received ${candles.length} candles for ${this.exchange.exchangeCode}:${this.symbol}`,
        );

        for (const candle of candles) {
          this.emit("candle", candle);
        }
      } catch (err) {
        if (err instanceof NetworkError) {
          logger.warn(
            `[CandlesWatcher] NetworkError occurred on ${this.exchange.exchangeCode}:${this.symbol}. Error: ${err.message}. Reconnecting in 3s...`,
          );
          await new Promise((resolve) => setTimeout(resolve, 3000)); // prevents infinite cycle
        } else if (err instanceof RequestTimeout) {
          logger.warn(err, `[CandlesWatcher] RequestTimeout occurred on ${this.exchange.exchangeCode}:${this.symbol}.`);
        } else {
          logger.error(
            err,
            `[CandlesWatcher] Unhandled error occurred on ${this.exchange.exchangeCode}:${this.symbol}. Watcher stopped.`,
          );
          this.disable();
          break;
        }
      }
    }
  }
}
