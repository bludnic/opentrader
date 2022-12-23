import { ApiProperty } from '@nestjs/swagger';
import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { DealSellFilled } from 'src/core/db/types/entities/grid-bots/deals/types';
import { BuyOrderFilledEntity } from 'src/core/db/types/entities/grid-bots/orders/buy/buy-order-filled.entity';
import { SellOrderFilledEntity } from 'src/core/db/types/entities/grid-bots/orders/sell/sell-order-filled.entity';
import { SellOrderIdleEntity } from 'src/core/db/types/entities/grid-bots/orders/sell/sell-order-idle.entity';

import {
  BuyOrderFilled,
  SellOrderFilled,
} from 'src/core/db/types/entities/grid-bots/orders/types';

export class DealSellFilledEntity implements DealSellFilled {
  id: string;

  @ApiProperty({
    type: () => BuyOrderFilledEntity,
  })
  buyOrder: BuyOrderFilled;

  @ApiProperty({
    type: () => SellOrderFilledEntity,
  })
  sellOrder: SellOrderFilled;

  @ApiProperty({
    enum: DealStatusEnum,
  })
  status: DealStatusEnum.SellFilled;

  constructor(deal: DealSellFilled) {
    Object.assign(this, deal);
  }
}
