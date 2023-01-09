import { OmitType } from '@nestjs/swagger';
import { TweetTradingBotDto } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';

export class CreateTweetTradingBotDto extends OmitType(TweetTradingBotDto, [
  'createdAt',
] as const) {}
