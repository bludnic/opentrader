import { ExchangeCode } from '@bifrost/types';
import { SymbolFilterDto } from './types/symbol-filter.dto';

export class SymbolInfoDto {
  symbolId: string;
  exchangeCode: ExchangeCode;

  exchangeSymbolId: string;
  baseCurrency: string;
  quoteCurrency: string;

  filters: SymbolFilterDto;
}
