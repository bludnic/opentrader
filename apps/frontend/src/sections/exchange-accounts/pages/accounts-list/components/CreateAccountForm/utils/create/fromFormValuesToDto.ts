import { CreateExchangeAccountRequestBodyDto } from "src/lib/bifrost/rtkApi";
import { CreateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

export function fromFormValuesToDto(
  values: CreateExchangeAccountFormValues
): CreateExchangeAccountRequestBodyDto {
  const {
    // account
    id,
    name,
    exchangeCode,

    // credentials
    apiKey,
    secretKey,
    passphrase,
    isDemoAccount,
  } = values;

  return {
    id,
    name,
    exchangeCode,

    credentials: {
      code: exchangeCode,
      apiKey,
      secretKey,
      passphrase,
      isDemoAccount,
    },
  };
}
