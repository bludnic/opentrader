import type { OrderSide } from "src/exchanges/api/trade/common/types";

export interface IPlaceStopMarketOrderRequest {
  /**
   * Instrument ID, e.g `ADA/USDT`.
   */
  symbol: string;
  side: OrderSide;
  /**
   * Quantity to buy or sell.
   * If type == limit, the quantity is base currency
   * If type == market, the quantity is quote currency
   */
  quantity: number;
  /**
   * Trigger price.
   */
  stopPrice: number;
}
