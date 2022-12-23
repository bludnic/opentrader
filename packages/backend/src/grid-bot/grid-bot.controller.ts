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
import { ExchangeAccount } from 'src/common/decorators/exchange-account.decorator';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
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
  async getBot(
    @Param('id') botId: string,
    @ExchangeAccount() exchangeAccount: IExchangeAccount,
  ): Promise<GetBotResponseBodyDto> {
    const gridBotService =
      this.gridBotServiceFactory.fromExchangeAccount(exchangeAccount);

    const bot = await gridBotService.getBot(botId);

    return {
      bot,
    };
  }

  @Post('/create')
  async createBot(
    @Body() body: CreateBotRequestBodyDto,
    @ExchangeAccount() exchangeAccount: IExchangeAccount,
    @FirebaseUser() user: IUser,
  ): Promise<CreateBotResponseBodyDto> {
    const gridBotService =
      this.gridBotServiceFactory.fromExchangeAccount(exchangeAccount);

    const bot = await gridBotService.createBot(body, user);

    return {
      bot,
    };
  }

  @Put('/start/:id')
  async startBot(
    @Param('id') botId: string,
    @ExchangeAccount() exchangeAccount: IExchangeAccount,
  ): Promise<StartBotResponseBodyDto> {
    const gridBotService =
      this.gridBotServiceFactory.fromExchangeAccount(exchangeAccount);

    const bot = await gridBotService.startBot(botId);

    return {
      bot,
    };
  }

  @Put('/stop/:id')
  async stopBot(
    @Param('id') botId: string,
    @ExchangeAccount() exchangeAccount: IExchangeAccount,
  ): Promise<StopBotResponseBodyDto> {
    const gridBotService =
      this.gridBotServiceFactory.fromExchangeAccount(exchangeAccount);

    await gridBotService.stopBot(botId);

    return {
      botId,
      message: 'Bot stopped',
    };
  }

  @Patch('/sync')
  async syncMarketOrders(
    @Query() query: SyncBotQueryParamsDto,
    @ExchangeAccount() exchangeAccount: IExchangeAccount,
  ): Promise<SyncBotResponseBodyDto> {
    const gridBotService =
      this.gridBotServiceFactory.fromExchangeAccount(exchangeAccount);

    const { botId } = query;

    try {
      const response = await gridBotService.syncMarketOrders(botId);

      return response;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  @Get('/current-asset-price')
  async currentAssetPrice(
    @Req() req,
    @ExchangeAccount() exchangeAccount: IExchangeAccount,
  ) {
    const gridBotService =
      this.gridBotServiceFactory.fromExchangeAccount(exchangeAccount);

    const currentAssetPrice = await gridBotService.getCurrentAssetPrice(
      'ADA',
      'USDT',
    );

    return {
      currentAssetPrice,
    };
  }
}
