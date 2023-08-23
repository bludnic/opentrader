import { ExchangeCode } from '@bifrost/types';

export class CreateMarketRequestDto {
  symbol: string;
  exchangeCode: ExchangeCode;
}
