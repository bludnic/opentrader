import { Create3CommasAccountRequestBodyDto } from "src/lib/bifrost/client";
import { CreateAccountFormValues } from "src/sections/3commas-accounts/pages/accounts-list/components/CreateAccountForm/types";

export function fromFormValuesToDto(
  values: CreateAccountFormValues
): Create3CommasAccountRequestBodyDto {
  const {
    // account
    id,
    name,

    // credentials
    apiKey,
    secretKey,
    isPaperAccount,
  } = values;

  return {
    id,
    name,

    credentials: {
      apiKey,
      secretKey,
      isPaperAccount,
    },
  };
}
