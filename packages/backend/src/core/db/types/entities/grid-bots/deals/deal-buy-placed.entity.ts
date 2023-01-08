import { ApiProperty } from '@nestjs/swagger';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { DealBuyPlaced } from 'src/core/db/types/entities/grid-bots/deals/types';
import { BuyOrderPlacedEntity } from 'src/core/db/types/entities/grid-bots/orders/buy/buy-order-placed.entity';
import { SellOrderIdleEntity } from 'src/core/db/types/entities/grid-bots/orders/sell/sell-order-idle.entity';
import {
  BuyOrderPlaced,
  SellOrderIdle,
} from 'src/core/db/types/entities/grid-bots/orders/types';

export class DealBuyPlacedEntity implements DealBuyPlaced {
  id: string;

  quantity: number;

  @ApiProperty({
    type: () => BuyOrderPlacedEntity,
  })
  buyOrder: BuyOrderPlaced;

  @ApiProperty({
    type: () => SellOrderIdleEntity,
  })
  sellOrder: SellOrderIdle;

  @ApiProperty({
    enum: DealStatusEnum,
  })
  status: DealStatusEnum.BuyPlaced;

  constructor(deal: DealBuyPlaced) {
    Object.assign(this, deal);
  }
}
