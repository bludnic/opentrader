import { ExchangeCode } from '@bifrost/types';

/**
 * Return example: OKX_UNI/USDT
 *
 * @param exchangeCode
 * @param baseCurrency
 * @param quoteCurrency
 * @returns
 */
export function genCandlesticksDocId(
  exchangeCode: ExchangeCode,
  baseCurrency: string,
  quoteCurrency: string,
) {
  return `${exchangeCode}_${baseCurrency}_${quoteCurrency}`;
}
