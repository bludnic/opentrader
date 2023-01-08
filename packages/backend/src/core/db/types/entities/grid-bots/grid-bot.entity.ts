import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { GridLineDto } from 'src/core/db/firestore/repositories/grid-bot/dto/grid-line.dto';
import { InitialInvestmentDto } from 'src/core/db/firestore/repositories/grid-bot/dto/initial-investment.dto';
import { DealBuyFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-filled.entity';
import { DealBuyPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-buy-placed.entity';
import { DealIdleEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-idle.entity';
import { DealSellFilledEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-filled.entity';
import { DealSellPlacedEntity } from 'src/core/db/types/entities/grid-bots/deals/deal-sell-placed.entity';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { InitialInvestment } from 'src/core/db/types/entities/grid-bots/investment/initial-investment.interface';

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
  baseCurrency: string; // e.g 1INCH

  @IsNotEmpty()
  @IsString()
  quoteCurrency: string; // e.g USDT

  @ApiProperty({
    type: () => GridLineDto,
    isArray: true,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => GridLineDto)
  gridLines: IGridLine[];

  @IsDefined()
  @IsBoolean()
  enabled: boolean;

  @IsDefined()
  @IsNumber()
  createdAt: number;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(DealIdleEntity) },
        { $ref: getSchemaPath(DealBuyPlacedEntity) },
        { $ref: getSchemaPath(DealBuyFilledEntity) },
        { $ref: getSchemaPath(DealSellPlacedEntity) },
        { $ref: getSchemaPath(DealSellFilledEntity) },
      ],
    },
  })
  deals: IDeal[]; // @todo поменять на DTO

  @ApiProperty({
    type: () => InitialInvestmentDto,
  })
  initialInvestment: InitialInvestment;

  userId: string;

  @IsDefined()
  @IsString()
  exchangeAccountId: string;

  constructor(bot: GridBotEntity) {
    Object.assign(this, bot);
  }
}
