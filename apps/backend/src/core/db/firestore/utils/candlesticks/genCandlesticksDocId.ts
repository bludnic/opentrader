import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';

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
