import { ISymbolPriceFilter } from '@bifrost/types';

export class SymbolPriceFilterDto implements ISymbolPriceFilter {
  maxPrice: string | null;
  minPrice: string | null;
  tickSize: string;
}
