import {
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCandlesticksHistoryResponseDto } from 'src/candlesticks/dto/get-candlesticks-history/get-candlesticks-history-response.dto';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { symbolId } from 'src/core/db/postgres/utils/candlesticks-history/symbolId';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import {
  CandlesticksServiceFactory,
  CandlesticksServiceFactorySymbol,
} from 'src/candlesticks/candlesticks-service.factory';

@Controller({
  path: 'candlesticks',
})
@ApiTags('Candlesticks History')
export class CandlesticksController {
  constructor(
    private readonly firestore: FirestoreService,
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
    private readonly logger: Logger,
    @Inject(CandlesticksServiceFactorySymbol)
    private readonly candlesticksServiceFactory: CandlesticksServiceFactory,
  ) {}

  @Get('/history/:baseCurrency/:quoteCurrency')
  async getCandlesticksHistory(
    @Param('baseCurrency') baseCurrency: string,
    @Param('quoteCurrency') quoteCurrency: string,
  ): Promise<GetCandlesticksHistoryResponseDto> {
    const symbol = symbolId(baseCurrency, quoteCurrency);

    const candlesticksService =
      await this.candlesticksServiceFactory.fromExchangeAccountId(
        'okx_real_testing',
      );

    const history = await candlesticksService.candlesticksHistory.findOne({
      where: {
        symbol,
      },
      relations: ['candlesticks'],
    });

    if (!history) {
      throw new NotFoundException(
        `[CandlesticksController] Not found history data for ${symbol} symbol`,
      );
    }

    return {
      history,
    };
  }

  @Put('/history/:baseCurrency/:quoteCurrency')
  async fetchExchangeCandlesticksHistory(
    @Param('baseCurrency') baseCurrency: string,
    @Param('quoteCurrency') quoteCurrency: string,
  ) {
    const candlesticksService =
      await this.candlesticksServiceFactory.fromExchangeAccountId(
        'okx_real_testing',
      );

    await candlesticksService.downloadHistory(baseCurrency, quoteCurrency);

    return {
      polling: true,
    };
  }
}
