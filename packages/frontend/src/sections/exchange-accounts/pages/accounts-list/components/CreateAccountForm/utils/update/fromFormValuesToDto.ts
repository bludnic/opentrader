import { UpdateExchangeAccountRequestBodyDto } from "src/lib/bifrost/client";
import { UpdateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

export function fromFormValuesToDto(
  values: UpdateExchangeAccountFormValues
): UpdateExchangeAccountRequestBodyDto {
  const {
    // account
    name,
    exchangeCode,

    // credentials
    apiKey,
    secretKey,
    passphrase,
    isDemoAccount,
  } = values;

  return {
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
