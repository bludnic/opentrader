import { ApiProperty } from '@nestjs/swagger';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { DealSellPlaced } from 'src/core/db/types/entities/grid-bots/deals/types';
import { BuyOrderFilledEntity } from 'src/core/db/types/entities/grid-bots/orders/buy/buy-order-filled.entity';
import { SellOrderPlacedEntity } from 'src/core/db/types/entities/grid-bots/orders/sell/sell-order-placed.entity';
import {
  BuyOrderFilled,
  SellOrderPlaced,
} from 'src/core/db/types/entities/grid-bots/orders/types';

export class DealSellPlacedEntity implements DealSellPlaced {
  id: string;

  quantity: number;

  @ApiProperty({
    type: () => BuyOrderFilledEntity,
  })
  buyOrder: BuyOrderFilled;

  @ApiProperty({
    type: () => SellOrderPlacedEntity,
  })
  sellOrder: SellOrderPlaced;

  @ApiProperty({
    enum: DealStatusEnum,
  })
  status: DealStatusEnum.SellPlaced;

  constructor(deal: DealSellPlaced) {
    Object.assign(this, deal);
  }
}
