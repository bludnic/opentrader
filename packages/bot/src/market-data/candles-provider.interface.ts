import { EventEmitter } from "node:events";
import { ICandlestick } from "@opentrader/types";

export interface ICandlesProvider extends EventEmitter {
  /**
   * Alias for `emit("start")`
   */
  start(): void;
  /**
   * Start fetching candles
   */
  emit(event: "start"): boolean;
  emit(event: "done"): boolean;
  emit(event: "candle", candle: ICandlestick): boolean;

  on(event: "start", listener: () => void): this;
  on(event: "done", listener: () => void): this;
  on(event: "candle", listener: (candle: ICandlestick) => void): this;
}
