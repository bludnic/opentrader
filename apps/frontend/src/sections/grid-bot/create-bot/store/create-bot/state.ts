import { TGridBot } from "src/types/trpc";
import { FetchStatus } from "src/utils/redux/types";

export interface CreateGridBotState {
  bot: TGridBot | null;
  status: FetchStatus;
  err: Error | null;
}

export const initialState: CreateGridBotState = {
  bot: null,
  status: FetchStatus.Idle,
  err: null,
};
