import type { OrderEntity } from "#db/entities";

type RequiredNotNull<T, K extends keyof T> = T & {
  [P in K]: NonNullable<T[P]>;
};

export function assertHasExchangeOrderId(
  order: OrderEntity,
): asserts order is RequiredNotNull<OrderEntity, "exchangeOrderId"> {
  if (!order.exchangeOrderId) {
    throw new Error(
      `assertHasExchangeOrderId: Order ${order.id} has missing "exchangeOrderId" field`,
    );
  }
}
