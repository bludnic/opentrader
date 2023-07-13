import { Body, Controller, Get, Inject, Logger, Param, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { GetCandlesticksHistoryReseponseDto } from './dto/get-candlesticks-history/get-candlesticks-history-response.dto';
import * as fs from 'fs';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import { delay } from 'src/common/helpers/delay';
import { CandlesticksService } from 'src/candlesticks/candlesticks.service';

@Controller({
  path: 'candlesticks',
})
@ApiTags('Candlesticks History')
export class CandlesticksController {
  constructor(
    private readonly firestore: FirestoreService,
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
    private readonly logger: Logger
  ) {}

  @Get('/history/:baseCurrency/:quoteCurrency')
  async getCandlesticksHistory(
    @Param('baseCurrency') baseCurrency: string,
    @Param('quoteCurrency') quoteCurrency: string,
  ): Promise<GetCandlesticksHistoryReseponseDto> {
    const history = await this.firestore.candlesticksHistory.findOne(
      ExchangeCode.OKX,
      baseCurrency,
      quoteCurrency,
    );

    return {
      candlesticks: history.candlesticks,
      updatedAt: history.updatedAt,
    };
  }

  @Put('/history/:baseCurrency/:quoteCurrency')
  async updateCandlesticksHistory(
    @Param('baseCurrency') baseCurrency: string,
    @Param('quoteCurrency') quoteCurrency: string,
    @Body('candles') candles: ICandlestick[],
  ): Promise<any> {
    const result = await this.firestore.candlesticksHistory.update(
      candles,
      ExchangeCode.OKX,
      baseCurrency,
      quoteCurrency,
    );

    return {
      result,
      candles,
    };
  }

  @Get('/fetch/:baseCurrency/:quoteCurrency')
  async fetchExchangeCandlesticks(
    @Param('baseCurrency') baseCurrency: string,
    @Param('quoteCurrency') quoteCurrency: string,
  ) {
    const exchangeService =
      await this.exchangeFactory.createFromExchangeAccountId(
        'okx_real_testing',
      );

    const candlesticksService = new CandlesticksService(
      this.firestore,
      exchangeService,
      this.logger,
    );

    candlesticksService.downloadHistory(baseCurrency, quoteCurrency)

    return {
      polling: true
    }
  }
}
