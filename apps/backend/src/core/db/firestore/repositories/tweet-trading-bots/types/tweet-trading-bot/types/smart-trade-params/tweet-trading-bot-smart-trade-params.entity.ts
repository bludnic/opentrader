import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsString, ValidateNested } from 'class-validator';
import { SmartTradePositionDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-position/smart-trade-position.dto';
import { SmartTradePositionEntity } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-position/smart-trade-position.entity';
import { ISmartTradePosition } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-position/smart-trade-position.interface';
import { SmartTradeStopLossDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-stop-loss/smart-trade-stop-loss.dto';
import { SmartTradeStopLossEntity } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-stop-loss/smart-trade-stop-loss.entity';
import { ISmartTradeStopLoss } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-stop-loss/smart-trade-stop-loss.interface';
import { SmartTradeTakeProfitDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-take-profit/smart-trade-take-profit.dto';
import { SmartTradeTakeProfitEntity } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-take-profit/smart-trade-take-profit.entity';
import { ISmartTradeTakeProfit } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-take-profit/smart-trade-take-profit.interface';
import { ITweetTradingBotSmartTradeParams } from './tweet-trading-bot-smart-trade-params.interface';

export class TweetTradingBotSmartTradeParamsEntity
  implements ITweetTradingBotSmartTradeParams
{
  @IsString()
  @IsDefined()
  account_id: string;

  @IsString()
  @IsDefined()
  // custom validator?
  pair: string; // USDT_BTC

  @IsString()
  @IsDefined()
  note: string;

  @ApiProperty({
    type: () => SmartTradePositionDto,
  })
  @ValidateNested()
  @Type(() => SmartTradePositionEntity)
  @IsDefined()
  position: ISmartTradePosition;

  @ApiProperty({
    type: () => SmartTradeTakeProfitDto,
  })
  @ValidateNested()
  @Type(() => SmartTradeTakeProfitEntity)
  @IsDefined()
  take_profit: ISmartTradeTakeProfit;

  @ApiProperty({
    type: () => SmartTradeStopLossDto,
  })
  @ValidateNested()
  @Type(() => SmartTradeStopLossEntity)
  @IsDefined()
  stop_loss: ISmartTradeStopLoss;

  constructor(params: TweetTradingBotSmartTradeParamsEntity) {
    Object.assign(this, params);
  }
}
