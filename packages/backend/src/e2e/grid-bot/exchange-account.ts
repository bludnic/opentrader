import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { user } from 'src/e2e/grid-bot/user';

export const exchangeAccountMock: IExchangeAccount = {
  id: 'okx_e2e_demo',
  name: 'OKX Spot Account #1',
  exchangeCode: ExchangeCode.OKX,
  credentials: {
    code: ExchangeCode.OKX,
    apiKey: '16df5f16-9c21-4157-b5e5-a7e2cbe5f15f',
    secretKey: '1ED5DD391EADCD362B5093E0DDE18A07',
    passphrase: 'T7NG4qR6hNW4LKJY',
    isDemoAccount: true,
  },
  userId: user.uid,
  createdAt: 1928479190,
};
