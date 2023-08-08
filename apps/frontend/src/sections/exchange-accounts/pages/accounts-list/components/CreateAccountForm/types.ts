import {
  CreateExchangeAccountRequestBodyDto,
  UpdateExchangeAccountRequestBodyDto,
} from "src/lib/bifrost/rtkApi";

export type CreateExchangeAccountFormValues = Pick<
  CreateExchangeAccountRequestBodyDto,
  "id" | "name" | "exchangeCode"
> &
  Pick<
    CreateExchangeAccountRequestBodyDto["credentials"],
    "apiKey" | "secretKey" | "passphrase" | "isDemoAccount"
  >;

export type UpdateExchangeAccountFormValues = Pick<
  UpdateExchangeAccountRequestBodyDto,
  "name" | "exchangeCode"
> &
  Pick<
    UpdateExchangeAccountRequestBodyDto["credentials"],
    "apiKey" | "secretKey" | "passphrase" | "isDemoAccount"
  >;
