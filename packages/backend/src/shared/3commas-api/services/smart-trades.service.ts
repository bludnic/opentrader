import {
  SmartTradeHistoryParams,
  SmartTradeParams,
} from '3commas-typescript/dist/types/types';
import { Order } from '3commas-typescript/src/types/generated-types';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API } from '3commas-typescript';

/**
 * @see https://github.com/3commas-io/3commas-official-api-docs/blob/master/smart_trades_v2_api.md
 */
@Injectable()
export class SmartTradesService {
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly threeCommasAPI: API;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {
    this.apiKey = this.config.get<string>('THREE_COMMAS_API_KEY');
    this.secretKey = this.config.get<string>('THREE_COMMAS_SECRET_KEY');

    this.threeCommasAPI = new API({
      key: this.apiKey, // Optional if only query endpoints with no security requirement
      secrets: this.secretKey, // Optional
      timeout: 60000, // Optional, in ms, default to 30000
      forcedMode: 'paper', // @todo env
    });
  }

  smartTradesHistory(params?: SmartTradeHistoryParams): Promise<Order[]> {
    return this.threeCommasAPI.getSmartTradeHistory();
  }

  createSmartTrade(params: SmartTradeParams): Promise<Order> {
    return this.threeCommasAPI.smartTrade(params);
  }
}
