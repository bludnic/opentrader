import { exchanges } from '@bifrost/exchanges';
import { GridBotEndpoint } from '@bifrost/swagger';
import { decomposeSymbolId } from '@bifrost/tools';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Scope,
  Param,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { exchangeAccountMock } from 'src/e2e/grid-bot/exchange-account';
import { CreateBotRequestBodyDto } from 'src/grid-bot/dto/create-bot/create-bot-request-body.dto';
import { CreateBotResponseBodyDto } from 'src/grid-bot/dto/create-bot/create-bot-response-body.dto';
import { GetActiveSmartTradesResponseDto } from 'src/grid-bot/dto/get-active-smart-trades/get-active-smart-trades-response.dto';
import { GetBotResponseBodyDto } from 'src/grid-bot/dto/get-bot/get-bot-response-body.dto';
import { GetBotsListResponseDto } from 'src/grid-bot/dto/get-bots-list/get-bots-list-response.dto';
import { GetCompletedSmartTradesResponseDto } from 'src/grid-bot/dto/get-completed-smart-trades/get-completed-smart-trades-response.dto';
import { StartBotResponseBodyDto } from 'src/grid-bot/dto/start-bot/start-bot-response-body.dto';
import { StopBotResponseBodyDto } from 'src/grid-bot/dto/stop-bot/stop-bot-response-body.dto';
import {
  GridBotServiceFactory,
  GridBotServiceFactorySymbol,
} from 'src/grid-bot/grid-bot-service.factory';
import { IsValidSymbolIdPipe } from 'src/symbols/utils/pipes/is-valid-symbol-id.pipe';

@Controller({
  path: 'grid-bot',
  scope: Scope.REQUEST, // @todo do I really need this?
})
@ApiTags(GridBotEndpoint.tagName())
export class GridBotController {
  constructor(
    @Inject(GridBotServiceFactorySymbol)
    private gridBotServiceFactory: GridBotServiceFactory,
    private firestore: FirestoreService,
  ) {}

  @Get()
  @ApiOperation(GridBotEndpoint.operation('getGridBots'))
  async getBots(@FirebaseUser() user: IUser): Promise<GetBotsListResponseDto> {
    const bots = await this.firestore.gridBot.findAllByUserId(user.uid);

    return {
      bots,
    };
  }

  @Get('/info/:id')
  @ApiOperation(GridBotEndpoint.operation('getGridBot'))
  async getBot(@Param('id') botId: string): Promise<GetBotResponseBodyDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    const bot = await gridBotService.getBot(botId);

    return {
      bot,
    };
  }

  @Post('/create')
  @ApiOperation(GridBotEndpoint.operation('createGridBot'))
  async createBot(
    @Body() body: CreateBotRequestBodyDto,
    @FirebaseUser() user: IUser,
  ): Promise<CreateBotResponseBodyDto> {
    const gridBotService =
      await this.gridBotServiceFactory.fromExchangeAccountId(
        body.exchangeAccountId,
      );

    const bot = await gridBotService.createBot(body, user);

    return {
      bot,
    };
  }

  @Put('/start/:id')
  @ApiOperation(GridBotEndpoint.operation('startGridBot'))
  async startBot(@Param('id') botId: string): Promise<StartBotResponseBodyDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    const { bot, currentAssetPrice } = await gridBotService.startBot(botId);

    return {
      bot,
      currentAssetPrice,
    };
  }

  @Put('/stop/:id')
  @ApiOperation(GridBotEndpoint.operation('stopGridBot'))
  async stopBot(@Param('id') botId: string): Promise<StopBotResponseBodyDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    await gridBotService.stopBot(botId);

    return {
      botId,
      message: 'Bot stopped',
    };
  }

  @Get('/current-asset-price')
  async currentAssetPrice(
    @Query('symbolId', IsValidSymbolIdPipe) symbolId: string,
  ) {
    const { exchangeCode, currencyPairSymbol } = decomposeSymbolId(symbolId);
    const exchangeService = exchanges[exchangeCode]();

    const data = await exchangeService.getMarketPrice({
      symbol: currencyPairSymbol,
    });

    return {
      currentAssetPrice: data.price,
    };
  }

  @Get('/:id/events')
  @ApiOperation(GridBotEndpoint.operation('getGridBotEvents'))
  async getEvents(@Param('id') botId: string) {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    const events = await gridBotService.getBotEvents();

    return {
      events,
    };
  }

  @Get('/:id/completed-smart-trades')
  @ApiOperation(GridBotEndpoint.operation('getGridBotCompletedSmartTrades'))
  async getCompletedSmartTrades(
    @Param('id') botId: string,
  ): Promise<GetCompletedSmartTradesResponseDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);
    const completedSmartTrades = await gridBotService.getCompletedSmartTrades(
      botId,
    );

    return {
      completedSmartTrades,
    };
  }

  @Get('/:id/active-smart-trades')
  @ApiOperation(GridBotEndpoint.operation('getGridBotActiveSmartTrades'))
  async getActiveSmartTrades(
    @Param('id') botId: string,
  ): Promise<GetActiveSmartTradesResponseDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);
    const activeSmartTrades = await gridBotService.getActiveSmartTrades(botId);

    return {
      activeSmartTrades,
    };
  }
}
