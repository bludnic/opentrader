import { ExchangeCode } from '@bifrost/types';
import { IExchangeContext } from 'src/core/exchanges/types/exchange-context.interface';
import { getExchangeConfig } from 'src/core/exchanges/utils/configs';

export const okxExchangeAccountDocumentId = 'okx_e2e_testing_account';

export const okxExchangeContext: IExchangeContext = {
  exchangeConfig: getExchangeConfig(ExchangeCode.OKX),
  exchangeAccount: {
    // @todo выпилить, юзать из firebase
    id: okxExchangeAccountDocumentId,
    name: 'OKX Spot Account #1',
    exchangeCode: ExchangeCode.OKX,
    credentials: {
      code: ExchangeCode.OKX,
      apiKey: '16df5f16-9c21-4157-b5e5-a7e2cbe5f15f',
      secretKey: '1ED5DD391EADCD362B5093E0DDE18A07',
      passphrase: 'T7NG4qR6hNW4LKJY',
      isDemoAccount: true,
    },
    userId: 'mock_user_id_1',
    createdAt: 1928479190,
  },
};
