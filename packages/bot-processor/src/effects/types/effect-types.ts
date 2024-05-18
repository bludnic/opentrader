export const USE_SMART_TRADE = "USE_SMART_TRADE";
export const USE_TRADE = "USE_TRADE";
export const BUY = "BUY";
export const SELL = "SELL";
export const REPLACE_SMART_TRADE = "REPLACE_SMART_TRADE";
export const GET_SMART_TRADE = "GET_SMART_TRADE";
export const CREATE_SMART_TRADE = "CREATE_SMART_TRADE";
export const CANCEL_SMART_TRADE = "CANCEL_SMART_TRADE";
export const USE_EXCHANGE = "USE_EXCHANGE";
export const USE_INDICATORS = "USE_INDICATORS";
export const USE_MARKET = "USE_MARKET";
export const USE_CANDLE = "USE_CANDLE";
export const USE_RSI_INDICATOR = "USE_RSI_INDICATOR";

export type EffectType =
  | typeof USE_SMART_TRADE
  | typeof USE_TRADE
  | typeof BUY
  | typeof SELL
  | typeof REPLACE_SMART_TRADE
  | typeof GET_SMART_TRADE
  | typeof CREATE_SMART_TRADE
  | typeof CANCEL_SMART_TRADE
  | typeof USE_EXCHANGE
  | typeof USE_INDICATORS
  | typeof USE_MARKET
  | typeof USE_CANDLE
  | typeof USE_RSI_INDICATOR;
