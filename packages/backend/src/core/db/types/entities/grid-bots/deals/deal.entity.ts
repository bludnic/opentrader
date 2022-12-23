import { DealStatusEnum } from 'src/core/db/types/common/enums/deal-status.enum';
import { DealBuyFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-filled.entity';
import { DealBuyPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-placed.entity';
import { DealIdleEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-idle.entity';
import { DealSellFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-filled.entity';
import { DealSellPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-placed.entity';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';

export class DealEntity<T = IDeal> {
  static from(deal: IDeal) {
    switch (deal.status) {
      case DealStatusEnum.Idle:
        return new DealIdleEntity(deal);
      case DealStatusEnum.BuyPlaced:
        return new DealBuyPlacedEntity(deal);
      case DealStatusEnum.BuyFilled:
        return new DealBuyFilledEntity(deal);
      case DealStatusEnum.SellPlaced:
        return new DealSellPlacedEntity(deal);
      case DealStatusEnum.SellFilled:
        return new DealSellFilledEntity(deal);
    }
  }

  static idle(deal): DealIdleEntity {
    return new DealIdleEntity(deal);
  }

  static buyPlaced(deal): DealBuyPlacedEntity {
    return new DealBuyPlacedEntity(deal);
  }

  static buyFilled(deal): DealBuyFilledEntity {
    return new DealBuyFilledEntity(deal);
  }

  static sellPlaced(deal): DealSellPlacedEntity {
    return new DealSellPlacedEntity(deal);
  }

  static sellFilled(deal): DealSellFilledEntity {
    return new DealSellFilledEntity(deal);
  }
}
