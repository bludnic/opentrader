import { SwaggerTags } from "../tags";
import { IEndpoint } from "../types";

const symbolEndpoint = {
  name: SwaggerTags.getName("symbol"),
  operations: {
    getSymbols: {},
    getSymbol: {},
    getSymbolCurrentPrice: {},
  },
} as const;

type OperationId = keyof (typeof symbolEndpoint)["operations"];

export const SymbolEndpoint: IEndpoint<OperationId> = {
  tagName() {
    return symbolEndpoint.name;
  },
  operation(operationId) {
    return {
      operationId,
    };
  },
};
