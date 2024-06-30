import type { OrderSide } from "./common/enums.js";

export interface IPlaceLimitOrderRequest {
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
  /**
   * Order price.
   */
  price: number;
}

export interface IPlaceLimitOrderResponse {
  /**
   * Order ID.
   */
  orderId: string;
  /**
   * Client-supplied order ID
   */
  clientOrderId?: string;
}
