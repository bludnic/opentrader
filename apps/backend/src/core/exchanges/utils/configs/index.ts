import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { IExchangeConfig } from 'src/core/exchanges/types/exchange-config.interface';
import { okxConfig } from 'src/core/exchanges/utils/configs/okx';

export type ExchangeConfigs = Record<ExchangeCode, IExchangeConfig>;

export const exchangeConfigs: ExchangeConfigs = {
  [ExchangeCode.OKX]: okxConfig,
};

export function getExchangeConfig(exchangeCode: ExchangeCode) {
  return exchangeConfigs[exchangeCode];
}
