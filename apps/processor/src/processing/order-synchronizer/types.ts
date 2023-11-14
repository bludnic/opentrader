import { OrderWithSmartTrade } from "@opentrader/db/dist";
import { IWatchOrder } from "@opentrader/types";

export type Event = "onFilled" | "onCanceled" | 'onPlaced';

export type Subscription = {
  event: Event;
  callback: (exchangeOrder: IWatchOrder, order: OrderWithSmartTrade) => void;
};
