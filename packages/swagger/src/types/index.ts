import { Tag } from "../tags";

export interface IEndpoint<OperationId> {
  tagName(): Tag["name"];
  operation(operationId: OperationId): {
    operationId: OperationId;
  };
}
