import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Scope,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { BotManagerService } from 'src/core/bot-manager/bot-manager.service';
import { IBotControl } from 'src/core/bot-manager/types/bot-control.interface';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import {
  ExchangeFactory,
  exchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import { CreateTradeBotRequestBodyDto } from './dto/create-bot/create-trade-bot-request-body.dto';
import { CreateTradeBotResponseBodyDto } from './dto/create-bot/create-trade-bot-response-body.dto';
import { GetTradeBotResponseBodyDto } from './dto/get-bot/get-trade-bot-response-body.dto';
import { GetTradeBotsListResponseDto } from './dto/get-bots-list/get-trade-bots-list-response.dto';
import { StartTradeBotResponseBodyDto } from './dto/start-bot/start-trade-bot-response-body.dto';
import { StopTradeBotResponseBodyDto } from './dto/stop-bot/stop-trade-bot-response-body.dto';
import {
  TradeBotServiceFactory,
  TradeBotServiceFactorySymbol,
} from './trade-bot-service.factory';

@Controller({
  path: 'trade-bot',
  scope: Scope.REQUEST,
})
@ApiTags('Trade Bot')
export class TradeBotController {
  constructor(
    @Inject(TradeBotServiceFactorySymbol)
    private tradeBotServiceFactory: TradeBotServiceFactory,
    private firestore: FirestoreService,
  ) {}

  @Get()
  @ApiOperation({
    operationId: 'getTradeBots',
  })
  async getBots(
    @FirebaseUser() user: IUser,
  ): Promise<GetTradeBotsListResponseDto> {
    const bots = await this.firestore.tradeBot.findAllByUserId(user.uid);

    return {
      bots,
    };
  }

  @Get('/info/:id')
  @ApiOperation({
    operationId: 'getTradeBot',
  })
  async getBot(
    @Param('id') botId: string,
  ): Promise<GetTradeBotResponseBodyDto> {
    const tradeBotService = await this.tradeBotServiceFactory.fromBotId(botId);

    const bot = await tradeBotService.getBot(botId);

    return {
      bot,
    };
  }

  @Post('/create')
  @ApiOperation({
    operationId: 'createTradeBot',
  })
  async createBot(
    @Body() body: CreateTradeBotRequestBodyDto,
    @FirebaseUser() user: IUser,
  ): Promise<CreateTradeBotResponseBodyDto> {
    const tradeBotService =
      await this.tradeBotServiceFactory.fromExchangeAccountId(
        body.exchangeAccountId,
      );

    const bot = await tradeBotService.createBot(body, user);

    return {
      bot,
    };
  }

  @Put('/start/:id')
  @ApiOperation({
    operationId: 'startTradeBot',
  })
  async startBot(
    @Param('id') botId: string,
  ): Promise<StartTradeBotResponseBodyDto> {
    const tradeBotService = await this.tradeBotServiceFactory.fromBotId(botId);

    const { bot } = await tradeBotService.startBot(botId);

    return {
      bot,
    };
  }

  @Put('/stop/:id')
  @ApiOperation({
    operationId: 'stopTradeBot',
  })
  async stopBot(
    @Param('id') botId: string,
  ): Promise<StopTradeBotResponseBodyDto> {
    const tradeBotService = await this.tradeBotServiceFactory.fromBotId(botId);

    await tradeBotService.stopBot(botId);

    return {
      botId,
      message: 'Bot stopped',
    };
  }
}
