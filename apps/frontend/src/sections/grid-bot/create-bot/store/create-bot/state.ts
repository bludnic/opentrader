import { GridBotDto } from "src/lib/bifrost/client";
import { FetchStatus } from "src/utils/redux/types";

export interface CreateGridBotState {
  bot: GridBotDto | null;
  status: FetchStatus;
  err: Error | null;
}

export const initialState: CreateGridBotState = {
  bot: null,
  status: FetchStatus.Idle,
  err: null,
};
