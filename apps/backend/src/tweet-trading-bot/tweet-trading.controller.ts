import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ThreeCommasAccountDto } from 'src/core/db/firestore/repositories/3commas-account/dto/3commas-account.dto';
import { CreateTweetTradingBotDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/dto/create-bot/create-tweet-trading-bot.dto';
import { UpdateTweetTradingBotDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/dto/update-bot/update-tweet-trading-bot.dto';
import { TweetTradingBotDto } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/tweet-trading-bot/tweet-trading-bot.dto';
import {
  TweetTradingServiceFactory,
  TweetTradingServiceFactorySymbol,
} from './tweet-trading-service.factory';
import {
  ThreeCommasApiServiceFactory,
  ThreeCommasApiServiceFactorySymbol,
} from 'src/shared/3commas-api/3commas-api-service.factory';
import { TwitterSignalsService } from 'src/marketplace/twitter-signals/twitter-signals.service';

@Controller('experiments/3c-tweet-trading')
@ApiTags('Experiments / Tweet Trading')
export class TweetTradingController {
  constructor(
    private readonly firestoreService: FirestoreService,
    @Inject(TweetTradingServiceFactorySymbol)
    private readonly tweetTradingServiceFactory: TweetTradingServiceFactory,
    private readonly twitterSignalsService: TwitterSignalsService,
    @Inject(ThreeCommasApiServiceFactorySymbol)
    private readonly threeCommasApiServiceFactory: ThreeCommasApiServiceFactory,
  ) {}

  @Get('signal-events')
  @ApiOperation({
    operationId: 'tweetSignalEvents',
  })
  async signalEvents() {
    const signalEvents = await this.twitterSignalsService.signalEvents();

    return signalEvents;
  }

  @Get('active-signal-events')
  @ApiOperation({
    operationId: 'tweetActiveSignalEvents',
  })
  async activeSignalEvents() {
    const activeSignalEvents =
      await this.twitterSignalsService.activeSignalEvents();

    return activeSignalEvents;
  }

  @Get('smart-trades-history/:accountId')
  async smartTradesHistory(@Param('accountId') accountId: string) {
    const threeCommasApiService =
      await this.threeCommasApiServiceFactory.createFromAccountId(accountId);

    const smartTrades =
      await threeCommasApiService.smartTrades.smartTradesHistory({});

    return smartTrades;
  }

  @Get('/bots')
  async getAllBots(): Promise<TweetTradingBotDto[]> {
    const bots = await this.firestoreService.tweetTradingBots.findAll();

    return bots;
  }

  @Get('/bot/:id')
  @ApiOperation({
    operationId: 'tweetGetBot',
  })
  async getBot(@Param('id') botId: string): Promise<TweetTradingBotDto> {
    const bot = await this.firestoreService.tweetTradingBots.findOne(botId);

    return bot;
  }

  @Post('/bot/create')
  @ApiOperation({
    operationId: 'tweetCreateBot',
  })
  async createBot(
    @Body() dto: CreateTweetTradingBotDto,
  ): Promise<TweetTradingBotDto> {
    const bot = await this.firestoreService.tweetTradingBots.create(dto);

    return bot;
  }

  @Put('/bot/update/:id')
  @ApiOperation({
    operationId: 'tweetUpdateBot',
  })
  async updateBot(
    @Param('id') botId: string,
    @Body() dto: UpdateTweetTradingBotDto,
  ): Promise<TweetTradingBotDto> {
    const bot = await this.firestoreService.tweetTradingBots.update(dto, botId);

    return bot;
  }

  // For debugging purposes
  @Get('/run-matching/:botId')
  async runMatching(@Param('botId') botId: string) {
    const tweetTradingService = await this.tweetTradingServiceFactory.fromBotId(
      botId,
    );

    const activeSignalEvents =
      await this.twitterSignalsService.activeSignalEvents();
    const report = await tweetTradingService.runMatching(
      botId,
      activeSignalEvents,
    );

    return {
      report,
    };
  }
}
