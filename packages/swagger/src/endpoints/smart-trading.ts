import { IEndpoint } from "../types";
import { SwaggerTags } from "../tags";

const smartTradingEndpoint = {
  name: SwaggerTags.getName("smart-trading"),
  operations: {
    getSmartTrades: {},
    getSmartTrade: {},
    createSmartTrade: {},
  },
} as const;

type OperationId = keyof (typeof smartTradingEndpoint)["operations"];

export const SmartTradingEndpoint: IEndpoint<OperationId> = {
  tagName() {
    return smartTradingEndpoint.name;
  },
  operation(operationId) {
    return {
      operationId,
    };
  },
};
