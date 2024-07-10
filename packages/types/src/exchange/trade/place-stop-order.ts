import type { OrderSide } from "./common/enums.js";

export interface IPlaceStopOrderRequest {
  type: "limit" | "market";
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
   * Order price.
   */
  price?: number;
  stopPrice: number;
}

export interface IPlaceStopOrderResponse {
  /**
   * Order ID.
   */
  orderId: string;
  /**
   * Client-supplied order ID
   */
  clientOrderId?: string;
}
