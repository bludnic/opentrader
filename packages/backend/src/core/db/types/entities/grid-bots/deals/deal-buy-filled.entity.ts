import { ApiProperty } from '@nestjs/swagger';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { DealBuyFilled } from 'src/core/db/types/entities/grid-bots/deals/types';
import { BuyOrderFilledEntity } from 'src/core/db/types/entities/grid-bots/orders/buy/buy-order-filled.entity';
import { SellOrderIdleEntity } from 'src/core/db/types/entities/grid-bots/orders/sell/sell-order-idle.entity';
import {
  BuyOrderFilled,
  SellOrderIdle,
} from 'src/core/db/types/entities/grid-bots/orders/types';

export class DealBuyFilledEntity implements DealBuyFilled {
  id: string;

  quantity: number;

  @ApiProperty({
    type: () => BuyOrderFilledEntity,
  })
  buyOrder: BuyOrderFilled;

  @ApiProperty({
    type: () => SellOrderIdleEntity,
  })
  sellOrder: SellOrderIdle;

  @ApiProperty({
    enum: DealStatusEnum,
  })
  status: DealStatusEnum.BuyFilled;

  constructor(deal: DealBuyFilled) {
    Object.assign(this, deal);
  }
}
