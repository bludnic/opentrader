import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CompletedDealBuyOrderEntity } from 'src/core/db/types/entities/grid-bots/completed-deals/types/completed-deal-buy-order.entity';
import { ICompletedDealBuyOrder } from 'src/core/db/types/entities/grid-bots/completed-deals/types/completed-deal-buy-order.interface';
import { CompletedDealSellOrderEntity } from 'src/core/db/types/entities/grid-bots/completed-deals/types/completed-deal-sell-order.entity';
import { ICompletedDealSellOrder } from 'src/core/db/types/entities/grid-bots/completed-deals/types/completed-deal-sell-order.interface';
import { DealBuyFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-filled.entity';
import { DealBuyPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-placed.entity';
import { DealIdleEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-idle.entity';
import { DealSellFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-filled.entity';
import { DealSellPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-placed.entity';
import { ICompletedDeal } from './completed-deal.interface';

@ApiExtraModels(
  DealIdleEntity,
  DealBuyPlacedEntity,
  DealBuyFilledEntity,
  DealSellPlacedEntity,
  DealSellFilledEntity,
)
export class CompletedDealEntity implements ICompletedDeal {
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    type: () => CompletedDealBuyOrderEntity,
  })
  buyOrder: ICompletedDealBuyOrder;

  @ApiProperty({
    type: () => CompletedDealSellOrderEntity,
  })
  sellOrder: ICompletedDealSellOrder;

  createdAt: number;
  botId: string;

  constructor(completedDeal: ICompletedDeal) {
    Object.assign(this, completedDeal);
  }
}
