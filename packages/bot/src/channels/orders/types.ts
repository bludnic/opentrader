import type { OrderWithSmartTrade } from "@opentrader/db";
import type { ExchangeCode, IWatchOrder } from "@opentrader/types";

export type OrderEvent = "onFilled" | "onCanceled" | "onPlaced";

export type Subscription = {
  event: OrderEvent;
  callback: (exchangeOrder: IWatchOrder, order: OrderWithSmartTrade, exchangeCode: ExchangeCode) => void;
};
