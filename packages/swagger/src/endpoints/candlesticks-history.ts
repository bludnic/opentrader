import { IEndpoint } from "../types";
import { SwaggerTags } from "../tags";

const candlesticksHistoryEndpoint = {
  name: SwaggerTags.getName("exchange-account"),
  operations: {
    getCandlesticksHistory: {},
    downloadCandlesticksHistory: {},
  },
} as const;

type OperationId = keyof (typeof candlesticksHistoryEndpoint)["operations"];

export const CandlesticksHistoryEndpoint: IEndpoint<OperationId> = {
  tagName() {
    return candlesticksHistoryEndpoint.name;
  },
  operation(operationId) {
    return {
      operationId,
    };
  },
};
