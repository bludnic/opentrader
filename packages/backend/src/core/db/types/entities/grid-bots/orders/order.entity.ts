import { Order } from 'src/core/db/types/entities/grid-bots/orders/types';
import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { BuyOrderFilledEntity } from './buy/buy-order-filled.entity';
import { BuyOrderIdleEntity } from './buy/buy-order-idle.entity';
import { BuyOrderPlacedEntity } from './buy/buy-order-placed.entity';
import { SellOrderFilledEntity } from './sell/sell-order-filled.entity';
import { SellOrderIdleEntity } from './sell/sell-order-idle.entity';
import { SellOrderPlacedEntity } from './sell/sell-order-placed.entity';

export class OrderEntity<T = Order> {
  static from(order: Order) {
    if (order.side === OrderSideEnum.Buy) {
      switch (order.status) {
        case OrderStatusEnum.Idle:
          return new BuyOrderIdleEntity(order);
        case OrderStatusEnum.Placed:
          return new BuyOrderPlacedEntity(order);
        case OrderStatusEnum.Filled:
          return new BuyOrderFilledEntity(order);
      }
    } else {
      switch (order.status) {
        case OrderStatusEnum.Idle:
          return new SellOrderIdleEntity(order);
        case OrderStatusEnum.Placed:
          return new SellOrderPlacedEntity(order);
        case OrderStatusEnum.Filled:
          return new SellOrderFilledEntity(order);
      }
    }
  }

  static buyIdle(order): BuyOrderIdleEntity {
    return new BuyOrderIdleEntity(order);
  }

  static buyPlaced(order): BuyOrderPlacedEntity {
    return new BuyOrderPlacedEntity(order);
  }

  static buyFilled(order): BuyOrderFilledEntity {
    return new BuyOrderFilledEntity(order);
  }

  static sellIdle(order): SellOrderIdleEntity {
    return new SellOrderIdleEntity(order);
  }

  static sellPlaced(order): SellOrderPlacedEntity {
    return new SellOrderPlacedEntity(order);
  }

  static sellFilled(order): SellOrderFilledEntity {
    return new SellOrderFilledEntity(order);
  }
}
