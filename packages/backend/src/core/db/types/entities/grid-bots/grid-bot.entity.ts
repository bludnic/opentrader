import {
  ApiExtraModels,
  ApiProperty,
  getSchemaPath,
  refs,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { DealBuyFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-filled.entity';
import { DealBuyPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-placed.entity';
import { DealIdleEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-idle.entity';
import { DealSellFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-filled.entity';
import { DealSellPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-placed.entity';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';

@ApiExtraModels(
  DealIdleEntity,
  DealBuyPlacedEntity,
  DealBuyFilledEntity,
  DealSellPlacedEntity,
  DealSellFilledEntity,
)
export class GridBotEntity implements IGridBot {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  account: string; // reference?

  @IsNotEmpty()
  @IsString()
  baseCurrency: string; // e.g 1INCH

  @IsNotEmpty()
  @IsString()
  quoteCurrency: string; // e.g USDT

  @IsDefined()
  @IsNumber()
  highPrice: number;

  @IsDefined()
  @IsNumber()
  lowPrice: number;

  @IsDefined()
  @IsNumber()
  gridLevels: number;

  @ApiProperty({
    title: 'Amount to buy per grid level in baseCurrency',
  })
  @IsDefined()
  @IsNumber()
  quantityPerGrid: number;

  @IsDefined()
  @IsBoolean()
  enabled: boolean;

  @IsDefined()
  @IsNumber()
  createdAt: number;

  @ApiProperty({
    type: () => Object,
    oneOf: [
      { $ref: getSchemaPath(DealIdleEntity) },
      { $ref: getSchemaPath(DealBuyPlacedEntity) },
      { $ref: getSchemaPath(DealBuyFilledEntity) },
      { $ref: getSchemaPath(DealSellPlacedEntity) },
      { $ref: getSchemaPath(DealSellFilledEntity) },
    ],
  })
  deals: IDeal[]; // @todo поменять на DTO

  userId: string;

  constructor(bot: GridBotEntity) {
    Object.assign(this, bot);
  }
}
