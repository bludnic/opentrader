import type { OrderSide } from "../common/types";

export interface IPlaceMarketOrderRequest {
  /**
   * Instrument ID, e.g `ADA-USDT`.
   */
  symbol: string;
  /**
   * Client-supplied order ID
   */
  clientOrderId?: string;
  side: OrderSide;
  /**
   * Quantity to buy or sell.
   */
  quantity: number;
}
