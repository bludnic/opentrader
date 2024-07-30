import type { OrderWithSmartTrade } from "@opentrader/db";
import type { IWatchOrder } from "@opentrader/types";

export type OrderEvent = "onFilled" | "onCanceled" | "onPlaced";

export type Subscription = {
  event: OrderEvent;
  callback: (exchangeOrder: IWatchOrder, order: OrderWithSmartTrade) => void;
};
