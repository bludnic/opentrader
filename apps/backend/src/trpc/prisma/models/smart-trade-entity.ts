import { $Enums, Order as OrderModel } from '@opentrader/prisma';
import { Order, toOrderModel } from './order';
import { SmartTradeWithOrders } from '../types/smart-trade/smart-trade-with-orders';

export type SmartTradeBuilder<
  EntryType extends $Enums.EntryType,
  TakeProfitType extends $Enums.TakeProfitType,
> = SmartTradeWithOrders & {
  // tradeType: `${EntryType}_${TakeProfitType},`;
  entryType: EntryType;
  takeProfitType: TakeProfitType;
} & EntryOrderBuilder<EntryType> &
  TakeProfitOrderBuilder<TakeProfitType>;

type EntryOrderBuilder<EntryType extends $Enums.EntryType> =
  EntryType extends 'Order'
    ? {
        entryOrder: Order<OrderModel>;
      }
    : {
        entryOrders: Order<OrderModel>[];
      };

type TakeProfitOrderBuilder<TakeProfitType extends $Enums.TakeProfitType> =
  TakeProfitType extends 'Order'
    ? {
        takeProfitOrder: Order<OrderModel>;
      }
    : {
        takeProfitOrders: Order<OrderModel>[];
      };

export type SmartTrade_Order_Order = SmartTradeBuilder<'Order', 'Order'>;
export type SmartTrade_Order_Ladder = SmartTradeBuilder<'Order', 'Ladder'>;
export type SmartTrade_Ladder_Order = SmartTradeBuilder<'Ladder', 'Order'>;
export type SmartTrade_Ladder_Ladder = SmartTradeBuilder<'Ladder', 'Ladder'>;

export type SmartTrade =
  | SmartTrade_Order_Order
  | SmartTrade_Order_Ladder
  | SmartTrade_Ladder_Order
  | SmartTrade_Ladder_Ladder;

export function toSmartTrade(entity: SmartTradeWithOrders): SmartTrade {
  const { orders, entryType, takeProfitType, type, ...other } = entity;

  if (type === 'DCA') {
    throw new Error('Unsupported type DCA');
  }

  const findSingleEntryOrder = (): Order<OrderModel> => {
    const entryOrder = orders.find(
      (order) => order.entityType === 'EntryOrder',
    );
    if (!entryOrder) throw new Error('Entry order not found');

    return toOrderModel(entryOrder);
  };

  const findSingleTakeProfitOrder = (): Order<OrderModel> => {
    const takeProfitOrder = orders.find(
      (order) => order.entityType === 'TakeProfitOrder',
    );
    if (!takeProfitOrder) throw new Error('TakeProfit order not found');

    return toOrderModel(takeProfitOrder);
  };

  const findMultipleEntryOrders = (): Order<OrderModel>[] => {
    return orders
      .filter((order) => order.entityType === 'EntryOrder')
      .map(toOrderModel);
  };
  const findMultipleTakeProfitOrders = (): Order<OrderModel>[] => {
    return orders
      .filter((order) => order.entityType === 'TakeProfitOrder')
      .map(toOrderModel);
  };

  if (entryType === 'Order' && takeProfitType === 'Order') {
    return {
      ...other,
      orders,

      type,
      entryType,
      takeProfitType,

      entryOrder: findSingleEntryOrder(),
      takeProfitOrder: findSingleTakeProfitOrder(),
    };
  } else if (entryType === 'Order' && takeProfitType === 'Ladder') {
    return {
      ...other,
      orders,

      type,
      entryType,
      takeProfitType,

      entryOrder: findSingleEntryOrder(),
      takeProfitOrders: findMultipleTakeProfitOrders(),
    };
  } else if (entryType === 'Ladder' && takeProfitType === 'Order') {
    return {
      ...other,
      orders,

      type,
      entryType,
      takeProfitType,

      entryOrders: findMultipleEntryOrders(),
      takeProfitOrder: findSingleTakeProfitOrder(),
    };
  } else if (entryType === 'Ladder' && takeProfitType === 'Ladder') {
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

  throw new Error('buildSmartTrade: Unexpected error');
}
