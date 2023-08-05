import { IEndpoint } from "../types";
import { SwaggerTags } from "../tags";

const backtestingEndpoint = {
  name: SwaggerTags.getName("backtesting"),
  operations: {
    runGridBotBacktest: {},
  },
} as const;

type OperationId = keyof (typeof backtestingEndpoint)["operations"];

export const BacktestingEndpoint: IEndpoint<OperationId> = {
  tagName() {
    return backtestingEndpoint.name;
  },
  operation(operationId) {
    return {
      operationId,
    };
  },
};
