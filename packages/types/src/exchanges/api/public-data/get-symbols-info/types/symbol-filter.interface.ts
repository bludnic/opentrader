export interface ISymbolPriceFilter {
  maxPrice: string | null;
  minPrice: string | null;
  tickSize: string;
}

export interface ISymbolLotFilter {
  maxQuantity: string;
  minQuantity: string;
  stepSize: string;
}

export interface ISymbolFilter {
  price: ISymbolPriceFilter;
  lot: ISymbolLotFilter;
}
