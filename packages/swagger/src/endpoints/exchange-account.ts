import { IEndpoint } from "../types";
import { SwaggerTags } from "../tags";

const exchangeAccountEndpoint = {
  name: SwaggerTags.getName("exchange-account"),
  operations: {
    getExchangeAccounts: {},
    getExchangeAccount: {},
    createExchangeAccount: {},
    updateExchangeAccount: {},
  },
} as const;

type OperationId = keyof (typeof exchangeAccountEndpoint)["operations"];

export const ExchangeAccountEndpoint: IEndpoint<OperationId> = {
  tagName() {
    return exchangeAccountEndpoint.name;
  },
  operation(operationId) {
    return {
      operationId,
    };
  },
};
