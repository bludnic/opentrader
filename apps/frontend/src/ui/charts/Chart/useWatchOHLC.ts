import { BarSize } from "@opentrader/types";
import { Exchange, type OHLCV } from "ccxt";
import { MutableRefObject, useEffect } from "react";

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
        const candles = await exchange.current!.watchOHLCV(
          currencyPair,
          barSize,
        );

        // shouldUpdate
        if (enabled) {
          onUpdate(candles[0]);
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
