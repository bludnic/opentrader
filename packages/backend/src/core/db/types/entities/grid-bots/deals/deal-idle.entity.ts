import { ApiProperty } from '@nestjs/swagger';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { DealIdle } from 'src/core/db/types/entities/grid-bots/deals/types';
import { BuyOrderIdleEntity } from 'src/core/db/types/entities/grid-bots/orders/buy/buy-order-idle.entity';
import { SellOrderIdleEntity } from 'src/core/db/types/entities/grid-bots/orders/sell/sell-order-idle.entity';
import {
  BuyOrderIdle,
  SellOrderIdle,
} from 'src/core/db/types/entities/grid-bots/orders/types';

export class DealIdleEntity implements DealIdle {
  id: string;

  @ApiProperty({
    type: () => BuyOrderIdleEntity,
  })
  buyOrder: BuyOrderIdle;

  @ApiProperty({
    type: () => SellOrderIdleEntity,
  })
  sellOrder: SellOrderIdle;

  @ApiProperty({
    enum: DealStatusEnum,
  })
  status: DealStatusEnum.Idle;

  constructor(deal: DealIdle) {
    Object.assign(this, deal);
  }
}
