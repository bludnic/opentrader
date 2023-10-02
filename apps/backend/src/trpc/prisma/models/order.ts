import { $Enums, Order as OrderModel } from '@opentrader/prisma';

type GenericOrderProps =
  | 'type'
  | 'status'
  | 'price'
  | 'filledPrice'
  | 'filledAt'
  | 'placedAt';

type OrderBuilder<
  OrderType extends $Enums.OrderType,
  OrderStatus extends $Enums.OrderStatus,
  O extends OrderModel = OrderModel,
> = {
  type: OrderType;
  status: OrderStatus;
  price: OrderType extends 'Limit' ? NonNullable<O['price']> : null;
  filledPrice: OrderStatus extends 'Filled'
    ? NonNullable<O['filledPrice']>
    : null;
  filledAt: OrderStatus extends 'Filled' ? NonNullable<O['filledAt']> : null;
  placedAt: OrderStatus extends 'Placed' | 'Filled' | 'Canceled'
    ? NonNullable<O['placedAt']>
    : null;
} & Omit<O, GenericOrderProps>;

export type LimitOrderIdle<T extends OrderModel> = OrderBuilder<
  'Limit',
  'Idle',
  T
>;
export type LimitOrderPlaced<T extends OrderModel> = OrderBuilder<
  'Limit',
  'Placed',
  T
>;
export type LimitOrderFilled<T extends OrderModel> = OrderBuilder<
  'Limit',
  'Filled',
  T
>;
export type LimitOrderCanceled<T extends OrderModel> = OrderBuilder<
  'Limit',
  'Canceled',
  T
>;
export type LimitOrderRevoked<T extends OrderModel> = OrderBuilder<
  'Limit',
  'Revoked',
  T
>;
export type LimitOrderDeleted<T extends OrderModel> = OrderBuilder<
  'Limit',
  'Deleted',
  T
>;

export type LimitOrder<T extends OrderModel = OrderModel> =
  | LimitOrderIdle<T>
  | LimitOrderPlaced<T>
  | LimitOrderFilled<T>
  | LimitOrderCanceled<T>
  | LimitOrderRevoked<T>
  | LimitOrderDeleted<T>;

export type MarketOrderIdle<T extends OrderModel> = OrderBuilder<
  'Market',
  'Idle',
  T
>;
export type MarketOrderPlaced<T extends OrderModel> = OrderBuilder<
  'Market',
  'Placed',
  T
>;
export type MarketOrderFilled<T extends OrderModel> = OrderBuilder<
  'Market',
  'Filled',
  T
>;
export type MarketOrderCanceled<T extends OrderModel> = OrderBuilder<
  'Market',
  'Canceled',
  T
>;
export type MarketOrderRevoked<T extends OrderModel> = OrderBuilder<
  'Market',
  'Revoked',
  T
>;
export type MarketOrderDeleted<T extends OrderModel> = OrderBuilder<
  'Market',
  'Deleted',
  T
>;

export type MarketOrder<T extends OrderModel = OrderModel> =
  | MarketOrderIdle<T>
  | MarketOrderPlaced<T>
  | MarketOrderFilled<T>
  | MarketOrderCanceled<T>
  | MarketOrderRevoked<T>
  | MarketOrderDeleted<T>;

export type Order<T extends OrderModel = OrderModel> =
  | LimitOrder<T>
  | MarketOrder<T>;

export function toOrderModel<T extends OrderModel>(order: T): Order<T> {
  const { type, status, price, filledPrice, filledAt, placedAt, ...baseProps } =
    order;

  if (type === 'Limit') {
    switch (status) {
      case 'Idle':
        return {
          ...baseProps,
          type,
          status,

          price: assertNonNullable(price, 'price'),
          filledPrice: null,
          filledAt: null,
          placedAt: null,
        };
      case 'Placed':
        return {
          ...baseProps,
          type,
          status,

          price: assertNonNullable(price, 'price'),
          filledPrice: null,
          filledAt: null,
          placedAt: assertNonNullable(placedAt, 'placedAt'),
        };
      case 'Filled':
        return {
          ...baseProps,
          type,
          status,

          price: assertNonNullable(price, 'price'),
          filledPrice: assertNonNullable(filledPrice, 'filledPrice'),
          filledAt: assertNonNullable(filledAt, 'filledAt'),
          placedAt: assertNonNullable(placedAt, 'placedAt'),
        };
      case 'Canceled':
        return {
          ...baseProps,
          type,
          status,

          price: assertNonNullable(price, 'price'),
          filledPrice: null,
          filledAt: null,
          placedAt: assertNonNullable(placedAt, 'placedAt'),
        };
      case 'Revoked':
        return {
          ...baseProps,
          type,
          status,

          price: assertNonNullable(price, 'price'),
          filledPrice: null,
          filledAt: null,
          placedAt: null,
        };
    }
  } else if (type === 'Market') {
    switch (status) {
      case 'Idle':
        return {
          ...baseProps,
          type,
          status,

          price: null,
          filledPrice: null,
          filledAt: null,
          placedAt: null,
        };
      case 'Placed':
        return {
          ...baseProps,
          type,
          status,

          price: null,
          filledPrice: null,
          filledAt: null,
          placedAt: assertNonNullable(placedAt, 'placedAt'),
        };
      case 'Filled':
        return {
          ...baseProps,
          type,
          status,

          price: null,
          filledPrice: assertNonNullable(filledPrice, 'filledPrice'),
          filledAt: assertNonNullable(filledAt, 'filledAt'),
          placedAt: assertNonNullable(placedAt, 'placedAt'),
        };
      case 'Canceled':
        return {
          ...baseProps,
          type,
          status,

          price: null,
          filledPrice: null,
          filledAt: null,
          placedAt: assertNonNullable(placedAt, 'placedAt'),
        };
      case 'Revoked':
        return {
          ...baseProps,
          type,
          status,

          price: null,
          filledPrice: null,
          filledAt: null,
          placedAt: null,
        };
    }
  }

  throw new Error('toOrderModel: Unexpected error');
}

function assertNonNullable<T extends number | string | Date | null>(
  value: T,
  name?: string,
): NonNullable<T> {
  if (value === null) {
    throw new Error(`assert: ${name} is null.`);
  }

  return value;
}
