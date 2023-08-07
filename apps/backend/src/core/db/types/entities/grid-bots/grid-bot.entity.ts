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
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { InitialInvestment } from 'src/core/db/types/entities/grid-bots/investment/initial-investment.interface';
import { AreGridLinesSortedInAscOrder } from 'src/core/db/utils/validation/grid-bot/are-grid-lines-sorted-in-asc-order.decorator';
import { GridBotSmartTradeRefEntity } from './smart-trades/smart-trade-ref.entity';
import { IGridBotSmartTradeRef } from './smart-trades/smart-trade-ref.interface';

@ApiExtraModels(
  GridBotSmartTradeRefEntity
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
  @AreGridLinesSortedInAscOrder()
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
        { $ref: getSchemaPath(GridBotSmartTradeRefEntity) },
      ],
    },
  })
  smartTrades: IGridBotSmartTradeRef[];

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
