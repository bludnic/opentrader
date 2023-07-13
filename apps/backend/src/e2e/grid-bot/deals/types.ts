import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';

export type GridBotE2EDeal = {
  id: string;
  status: DealStatusEnum;
  buy: {
    price: number;
    status: OrderStatusEnum;
  };
  sell: {
    price: number;
    status: OrderStatusEnum;
  };
};
