import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTweetTradingBotDto } from './db/repositories/tweet-trading-bots/dto/create-bot/create-tweet-trading-bot.dto';
import { UpdateTweetTradingBotDto } from './db/repositories/tweet-trading-bots/dto/update-bot/update-tweet-trading-bot.dto';
import { TweetTradingBotDto } from './db/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';
import { TweetTradingDbService } from './db/tweet-trading-db.service';
import { TweetTradingService } from './tweet-trading.service';
import { TwitterSignalsService } from 'src/marketplace/twitter-signals/twitter-signals.service';
import { ThreeCommasApiService } from 'src/shared/3commas-api/3commas-api.service';

@Controller('experiments/3c-tweet-trading')
@ApiTags('Experiments / Tweet Trading')
export class TweetTradingController {
  constructor(
    private readonly tweetTradingService: TweetTradingService,
    private readonly twitterSignalsService: TwitterSignalsService,
    private readonly threeCommasApiService: ThreeCommasApiService,
    private readonly db: TweetTradingDbService,
  ) {}

  @Get('signal-events')
  async signalEvents() {
    const signalEvents = await this.twitterSignalsService.signalEvents();

    return signalEvents;
  }

  @Get('active-signal-events')
  async activeSignalEvents() {
    const activeSignalEvents =
      await this.twitterSignalsService.activeSignalEvents();

    return activeSignalEvents;
  }

  @Get('smart-trades-history')
  async smartTradesHistory() {
    const smartTrades =
      await this.threeCommasApiService.smartTrades.smartTradesHistory({});

    return smartTrades;
  }

  @Get('/bots')
  async getAllBots(): Promise<TweetTradingBotDto[]> {
    const bots = await this.db.bots.findAll();

    return bots;
  }

  @Get('/bot/:id')
  async getBot(@Param('id') botId: string): Promise<TweetTradingBotDto> {
    const bot = await this.db.bots.findOne(botId);

    return bot;
  }

  @Post('/bot/create')
  async createBot(
    @Body() dto: CreateTweetTradingBotDto,
  ): Promise<TweetTradingBotDto> {
    const bot = await this.db.bots.create(dto);

    return bot;
  }

  @Put('/bot/update/:id')
  async updateBot(
    @Param('id') botId: string,
    @Body() dto: UpdateTweetTradingBotDto,
  ): Promise<TweetTradingBotDto> {
    const bot = await this.db.bots.update(dto, botId);

    return bot;
  }

  // For debugging purposes
  @Get('/run-matching')
  async runMatching() {
    const report = await this.tweetTradingService.runMatching();

    return {
      report,
    };
  }
}
