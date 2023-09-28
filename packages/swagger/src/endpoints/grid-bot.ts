import { IEndpoint } from "../types";
import { SwaggerTags } from "../tags";

const gridBotEndpoint = {
  name: SwaggerTags.getName("grid-bot"),
  operations: {
    getGridBots: {},
    getGridBot: {},
    createGridBot: {},
    startGridBot: {},
    stopGridBot: {},
    getGridBotEvents: {},
    getGridBotCompletedSmartTrades: {},
    getGridBotActiveSmartTrades: {},
  },
} as const;

type OperationId = keyof (typeof gridBotEndpoint)["operations"];

export const GridBotEndpoint: IEndpoint<OperationId> = {
  tagName() {
    return gridBotEndpoint.name;
  },
  operation(operationId) {
    return {
      operationId,
    };
  },
};
