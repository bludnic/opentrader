import { ExchangeCode, ISymbolInfo } from "@bifrost/types";
import { SymbolFilterDto } from './types/symbol-filter.dto';

export class SymbolInfoDto implements ISymbolInfo {
  symbolId: string;
  currencyPair: string;
  exchangeCode: ExchangeCode;

  exchangeSymbolId: string;
  baseCurrency: string;
  quoteCurrency: string;

  filters: SymbolFilterDto;
}
