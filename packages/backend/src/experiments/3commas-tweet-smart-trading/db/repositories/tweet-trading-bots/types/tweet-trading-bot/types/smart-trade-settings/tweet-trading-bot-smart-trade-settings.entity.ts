import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ITweetTradingBotSmartTradeSettings } from './tweet-trading-bot-smart-trade-settings.interface';

export class TweetTradingBotSmartTradeSettingsEntity
  implements ITweetTradingBotSmartTradeSettings
{
  @ApiProperty({
    description: '3commas accountId',
  })
  @IsNumber()
  @IsDefined()
  accountId: number;

  @ApiProperty({
    description: 'Volume to buy',
  })
  @IsDefined()
  @IsNumber()
  volume: number;

  @IsDefined()
  @IsNumber()
  takeProfitPercent: number;

  @IsDefined()
  @IsNumber()
  stopLossPercent: number;

  @IsString()
  @IsNotEmpty()
  baseCurrency: string;

  @IsString()
  @IsNotEmpty()
  quoteCurrency: string;

  @IsString()
  @IsNotEmpty()
  note: string;

  constructor(settings: TweetTradingBotSmartTradeSettingsEntity) {
    Object.assign(this, settings);
  }
}
