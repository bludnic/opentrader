import type { OrderSide } from "src/exchanges/api/trade/common/types";

type OrderType = "limit" | "market";

type OCOOrderBase<
  TPType extends OrderType,
  SLType extends OrderType,
> = {
  /**
   * Take Profit order type
   */
  tpType: TPType;
  /**
   * Stop Loss order type
   */
  slType: SLType;
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
   * Take Profit trigger price
   */
  tpStopPrice: number;
  /**
   * Stop Loss trigger price
   */
  slStopPrice: number;
} & (TPType extends "limit" ? { tpPrice: number } : {}) &
  (SLType extends "limit" ? { slPrice: number } : {});

export type IPlaceOCOOrderRequest =
  | OCOOrderBase<"limit", "limit">
  | OCOOrderBase<"limit", "market">
  | OCOOrderBase<"market", "limit">
  | OCOOrderBase<"market", "market">;
