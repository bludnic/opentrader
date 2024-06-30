import type { OrderSide } from "./common/enums.js";

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

export interface IPlaceMarketOrderResponse {
  /**
   * Order ID.
   */
  orderId: string;
  /**
   * Client-supplied order ID
   */
  clientOrderId?: string;
}
