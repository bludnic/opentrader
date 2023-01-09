import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ITweetTradingBot } from './tweet-trading-bot.interface';
import { TweetTradingBotSmartTradeSettingsDto } from './types/smart-trade-settings/tweet-trading-bot-smart-trade-settings.dto';
import { TweetTradingBotSmartTradeSettingsEntity } from './types/smart-trade-settings/tweet-trading-bot-smart-trade-settings.entity';
import { ITweetTradingBotSmartTradeSettings } from './types/smart-trade-settings/tweet-trading-bot-smart-trade-settings.interface';

export class TweetTradingBotEntity implements ITweetTradingBot {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsDefined()
  enabled: boolean;

  @ApiProperty({
    type: () => TweetTradingBotSmartTradeSettingsDto,
  })
  @ValidateNested()
  @Type(() => TweetTradingBotSmartTradeSettingsEntity)
  @IsDefined()
  smartTradeSettings: ITweetTradingBotSmartTradeSettings;

  /**
   * IDs of signals to watch.
   */
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsDefined()
  watchSignalsIds: string[];
  /**
   * IDs of signal events already used in SmartTrades.
   * To avoid duplication of SmartTrades with the same signal event.
   */
  @IsArray()
  @IsString({ each: true })
  @IsDefined()
  usedSignalEventsIds: string[];

  createdAt: string;

  constructor(bot: TweetTradingBotEntity) {
    Object.assign(this, bot);
  }
}
