import { Update3CommasAccountRequestBodyDto } from "src/lib/bifrost/client";
import { UpdateAccountFormValues } from "src/sections/3commas-accounts/pages/accounts-list/components/CreateAccountForm/types";

export function fromFormValuesToDto(
  values: UpdateAccountFormValues
): Update3CommasAccountRequestBodyDto {
  const {
    // account
    name,

    // credentials
    apiKey,
    secretKey,
    isPaperAccount,
  } = values;

  return {
    name,

    credentials: {
      apiKey,
      secretKey,
      isPaperAccount,
    },
  };
}
