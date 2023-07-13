import { OmitType } from '@nestjs/swagger';
import { TweetTradingBotDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';

export class UpdateTweetTradingBotDto extends OmitType(TweetTradingBotDto, [
  'id',
  'createdAt',
] as const) {}
