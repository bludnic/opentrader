import type { OrderSide } from "src/exchanges/api/trade/common/types";

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
