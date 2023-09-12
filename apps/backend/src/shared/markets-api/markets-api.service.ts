import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  CandlesticksApi,
  ExchangesApi,
  MarketsApi,
} from 'src/lib/markets-api/client';

@Injectable()
export class MarketsApiService {
  public basePath: string;

  public exchanges: ExchangesApi;
  public markets: MarketsApi;
  public candlesticks: CandlesticksApi;

  constructor(private config: ConfigService) {
    this.basePath = config.getOrThrow<string>('marketsApi.url');

    this.exchanges = new ExchangesApi(undefined, this.basePath);
    this.markets = new MarketsApi(undefined, this.basePath);
    this.candlesticks = new CandlesticksApi(undefined, this.basePath);
  }
}
