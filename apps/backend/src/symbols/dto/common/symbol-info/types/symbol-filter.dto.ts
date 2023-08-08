import { ISymbolFilter } from '@bifrost/types';
import { SymbolLotFilterDto } from './symbol-lot-filter.dto';
import { SymbolPriceFilterDto } from './symbol-price-filter.dto';

export class SymbolFilterDto implements ISymbolFilter {
  price: SymbolPriceFilterDto;
  lot: SymbolLotFilterDto;
}
