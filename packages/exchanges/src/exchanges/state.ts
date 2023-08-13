import { ExchangeCode } from "@bifrost/types";
import { Dictionary, Market } from "ccxt";

/**
 * Share `markets` across all Exchange instances.
 */
const state: Record<ExchangeCode, { markets?: Dictionary<Market> }> = {
  [ExchangeCode.OKX]: {},
};

export function cacheMarkets(
  markets: Dictionary<Market>,
  exchangeCode: ExchangeCode
): void {
  state[exchangeCode].markets = markets;
}

export function getCachedMarkets(
  exchangeCode: ExchangeCode
): Dictionary<Market> | undefined {
  return state[exchangeCode].markets;
}
