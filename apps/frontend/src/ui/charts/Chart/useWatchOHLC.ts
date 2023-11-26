import type { BarSize } from "@opentrader/types";
import { NetworkError } from "ccxt";
import type { Exchange, OHLCV } from "ccxt";
import type { MutableRefObject } from "react";
import { useEffect } from "react";

/**
 * Watch new candles using WebSockets
 */
export function useWatchOHLC(
  exchange: MutableRefObject<Exchange | null>,
  currencyPair: string,
  barSize: BarSize,
  onUpdate: (candle: OHLCV) => void,
) {
  useEffect(() => {
    if (!exchange.current) return;

    let enabled = true;
    const watchNewCandle = async () => {
      console.log(`WS: Subscribed to ${barSize} candle of ${currencyPair}`);
      while (enabled) {
        try {
          const candles = await exchange.current!.watchOHLCV(
            currencyPair,
            barSize,
          );

          // shouldUpdate
          if (enabled) {
            onUpdate(candles[0]);
          }
        } catch (err) {
          if (err instanceof NetworkError) {
            console.log(`WS: Socket connection closed`, err);
          } else {
            throw err;
          }
        }
      }
    };

    void watchNewCandle();

    return () => {
      enabled = false;
      console.log("WS: Unsubscribed");
    };
  }, [exchange, currencyPair, barSize]);
}
