import type { EventEmitter } from "node:events";
import type { ICandlestick } from "@opentrader/types";

export interface ICandlesProvider extends EventEmitter {
  /**
   * Alias for `emit("start")`
   */
  start: () => void;
  /**
   * Start fetching candles
   */
  emit: ((event: "start") => boolean) &
    ((event: "done") => boolean) &
    ((event: "candle", candle: ICandlestick) => boolean);

  on: ((event: "start", listener: () => void) => this) &
    ((event: "done", listener: () => void) => this) &
    ((event: "candle", listener: (candle: ICandlestick) => void) => this);
}
