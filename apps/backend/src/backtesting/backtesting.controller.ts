import { arithmeticGridBot } from '@bifrost/bot-templates';
import { BacktestingEndpoint } from '@bifrost/swagger';
import { Body, Controller, Post, Scope } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RunGridBotBacktestByBotIdDto } from 'src/backtesting/dto/grid-bot/run-grid-bot-backtest-by-bot-id.dto';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { BacktestingService } from './backtesting.service';
import { RunGridBotBacktestRequestBodyDto } from './dto/grid-bot/run-backtest/run-grid-bot-backtest-request-body.dto';
import { RunGridBotBacktestResponseBodyDto } from './dto/grid-bot/run-backtest/run-grid-bot-backtest-response-body.dto';

@Controller({
  path: 'backtesting',
  scope: Scope.REQUEST,
})
@ApiTags(BacktestingEndpoint.tagName())
export class BacktestingController {
  constructor(
    private readonly backtesting: BacktestingService,
    private readonly firestoreService: FirestoreService,
  ) {}

  @Post('/grid-bot/test')
  async runByBotId(
    @FirebaseUser() user: IUser,
    @Body() body: RunGridBotBacktestByBotIdDto,
  ): Promise<RunGridBotBacktestResponseBodyDto> {
    const { botId, startDate, endDate, exchangeCode } = body;
    const bot = await this.firestoreService.gridBot.findOne(botId);

    const report = await this.backtesting.run(
      bot,
      arithmeticGridBot,
      exchangeCode,
      startDate,
      endDate,
    );

    return report;
  }

  @Post('/grid-bot/test/run')
  @ApiOperation(BacktestingEndpoint.operation('runGridBotBacktest'))
  async runTest(
    @FirebaseUser() user: IUser,
    @Body() body: RunGridBotBacktestRequestBodyDto,
  ): Promise<RunGridBotBacktestResponseBodyDto> {
    const { bot: botDto, startDate, endDate, exchangeCode } = body;

    const bot: IGridBot = {
      ...botDto,
      gridLines: [...botDto.gridLines].sort(
        (left, right) => left.price - right.price,
      ), // @todo validation
      id: 'doesnt_matter', // @todo make a helper function
      name: 'Doesnt matter',
      initialInvestment: {
        baseCurrency: {
          price: 0,
          quantity: 0,
        },
        quoteCurrency: {
          quantity: 0,
        },
      },
      enabled: true,
      createdAt: Date.now(),
      exchangeAccountId: '1',
      userId: '0',
      smartTrades: [],
    };

    const report = await this.backtesting.run(
      bot,
      arithmeticGridBot,
      exchangeCode,
      startDate,
      endDate,
    );

    return report;
  }
}
