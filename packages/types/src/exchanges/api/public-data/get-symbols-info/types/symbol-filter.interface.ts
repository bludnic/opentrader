export interface ISymbolFilter {
  precision: PrecisionFilter;
  decimals: PrecisionDecimals;
  limits: LimitsFilter;
}

export interface PrecisionFilter {
  amount?: number;
  price?: number;
}

export interface PrecisionDecimals {
  amount?: number;
  price?: number;
}

export interface LimitsFilter {
  amount?: MinMaxFilter;
  cost?: MinMaxFilter;
  leverage?: MinMaxFilter;
  price?: MinMaxFilter;
}

export interface MinMaxFilter {
  min?: number;
  max?: number;
}
