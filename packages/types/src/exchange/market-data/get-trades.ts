import { OrderSide } from "../trade/common/enums.js";

export interface ITrade {
  id: string;
  amount: number;
  price: number;
  timestamp: number;
  side: OrderSide;
  symbol: string;
  takerOrMaker?: "taker" | "maker" | string;
}
