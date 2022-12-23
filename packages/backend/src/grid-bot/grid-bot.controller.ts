import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
  Put,
  Query,
  Scope,
  Req,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { exchangeAccountMock } from 'src/e2e/grid-bot/exchange-account';
import { CreateBotRequestBodyDto } from 'src/grid-bot/dto/create-bot/create-bot-request-body.dto';
import { CreateBotResponseBodyDto } from 'src/grid-bot/dto/create-bot/create-bot-response-body.dto';
import { GetBotResponseBodyDto } from 'src/grid-bot/dto/get-bot/get-bot-response-body.dto';
import { StartBotResponseBodyDto } from 'src/grid-bot/dto/start-bot/start-bot-response-body.dto';
import { StopBotResponseBodyDto } from 'src/grid-bot/dto/stop-bot/stop-bot-response-body.dto';
import { SyncBotQueryParamsDto } from 'src/grid-bot/dto/sync-bot/sync-bot-query-params.dto';
import { SyncBotResponseBodyDto } from 'src/grid-bot/dto/sync-bot/sync-bot-response-body.dto';
import {
  GridBotServiceFactory,
  GridBotServiceFactorySymbol,
} from 'src/grid-bot/grid-bot-service.factory';

@Controller({
  path: 'grid-bot',
  scope: Scope.REQUEST, // @todo do I really need this?
})
@ApiTags('Grid Bot')
export class GridBotController {
  constructor(
    @Inject(GridBotServiceFactorySymbol)
    private gridBotServiceFactory: GridBotServiceFactory,
  ) {}

  @Get('/info/:id')
  async getBot(@Param('id') botId: string): Promise<GetBotResponseBodyDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    const bot = await gridBotService.getBot(botId);

    return {
      bot,
    };
  }

  @Post('/create')
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
  async startBot(@Param('id') botId: string): Promise<StartBotResponseBodyDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    const bot = await gridBotService.startBot(botId);

    return {
      bot,
    };
  }

  @Put('/stop/:id')
  async stopBot(@Param('id') botId: string): Promise<StopBotResponseBodyDto> {
    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    await gridBotService.stopBot(botId);

    return {
      botId,
      message: 'Bot stopped',
    };
  }

  @Patch('/sync')
  async syncMarketOrders(
    @Query() queryParams: SyncBotQueryParamsDto,
  ): Promise<SyncBotResponseBodyDto> {
    const { botId } = queryParams;

    const gridBotService = await this.gridBotServiceFactory.fromBotId(botId);

    try {
      const response = await gridBotService.syncMarketOrders(botId);

      return response;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get('/current-asset-price')
  async currentAssetPrice(@Req() req) {
    const gridBotService =
      this.gridBotServiceFactory.fromExchangeAccount(exchangeAccountMock);

    const currentAssetPrice = await gridBotService.getCurrentAssetPrice(
      'ADA',
      'USDT',
    );

    return {
      currentAssetPrice,
    };
  }
}
