import type { $Enums } from "@prisma/client";
import type { SmartTradeWithOrders } from "#db/types/smart-trade";
import type { OrderEntity } from "./order.entity";
import { toOrderEntity } from "./order.entity";

export type SmartTradeEntityBuilder<
  EntryType extends $Enums.EntryType,
  TakeProfitType extends $Enums.TakeProfitType,
> = SmartTradeWithOrders & {
  // tradeType: `${EntryType}_${TakeProfitType},`;
  entryType: EntryType;
  takeProfitType: TakeProfitType;
} & EntryOrderBuilder<EntryType> &
  TakeProfitOrderBuilder<TakeProfitType>;

type EntryOrderBuilder<EntryType extends $Enums.EntryType> =
  EntryType extends "Order"
    ? {
        entryOrder: OrderEntity;
      }
    : {
        entryOrders: OrderEntity[];
      };

type TakeProfitOrderBuilder<TakeProfitType extends $Enums.TakeProfitType> =
  TakeProfitType extends "Order"
    ? {
        takeProfitOrder: OrderEntity;
      }
    : {
        takeProfitOrders: OrderEntity[];
      };

export type SmartTradeEntity_Order_Order = SmartTradeEntityBuilder<
  "Order",
  "Order"
>;
export type SmartTradeEntity_Order_Ladder = SmartTradeEntityBuilder<
  "Order",
  "Ladder"
>;
export type SmartTradeEntity_Ladder_Order = SmartTradeEntityBuilder<
  "Ladder",
  "Order"
>;
export type SmartTradeEntity_Ladder_Ladder = SmartTradeEntityBuilder<
  "Ladder",
  "Ladder"
>;

export type SmartTradeEntity =
  | SmartTradeEntity_Order_Order
  | SmartTradeEntity_Order_Ladder
  | SmartTradeEntity_Ladder_Order
  | SmartTradeEntity_Ladder_Ladder;

export function toSmartTradeEntity(
  entity: SmartTradeWithOrders,
): SmartTradeEntity {
  const { orders, entryType, takeProfitType, type, ...other } = entity;

  if (type === "DCA") {
    throw new Error("Unsupported type DCA");
  }

  const findSingleEntryOrder = (): OrderEntity => {
    const entryOrder = orders.find(
      (order) => order.entityType === "EntryOrder",
    );
    if (!entryOrder) throw new Error("Entry order not found");

    return toOrderEntity(entryOrder);
  };

  const findSingleTakeProfitOrder = (): OrderEntity => {
    const takeProfitOrder = orders.find(
      (order) => order.entityType === "TakeProfitOrder",
    );
    if (!takeProfitOrder) throw new Error("TakeProfit order not found");

    return toOrderEntity(takeProfitOrder);
  };

  const findMultipleEntryOrders = (): OrderEntity[] => {
    return orders
      .filter((order) => order.entityType === "EntryOrder")
      .map(toOrderEntity);
  };
  const findMultipleTakeProfitOrders = (): OrderEntity[] => {
    return orders
      .filter((order) => order.entityType === "TakeProfitOrder")
      .map(toOrderEntity);
  };

  if (entryType === "Order" && takeProfitType === "Order") {
    return {
      ...other,
      orders,

      type,
      entryType,
      takeProfitType,

      entryOrder: findSingleEntryOrder(),
      takeProfitOrder: findSingleTakeProfitOrder(),
    };
  } else if (entryType === "Order" && takeProfitType === "Ladder") {
    return {
      ...other,
      orders,

      type,
      entryType,
      takeProfitType,

      entryOrder: findSingleEntryOrder(),
      takeProfitOrders: findMultipleTakeProfitOrders(),
    };
  } else if (entryType === "Ladder" && takeProfitType === "Order") {
    return {
      ...other,
      orders,

      type,
      entryType,
      takeProfitType,

      entryOrders: findMultipleEntryOrders(),
      takeProfitOrder: findSingleTakeProfitOrder(),
    };
  } else if (entryType === "Ladder" && takeProfitType === "Ladder") {
    return {
      ...other,
      orders,

      type,
      entryType,
      takeProfitType,

      entryOrders: findMultipleEntryOrders(),
      takeProfitOrders: findMultipleTakeProfitOrders(),
    };
  }

  throw new Error("buildSmartTrade: Unexpected error");
}
