import { SymbolInfoDto } from 'src/lib/bifrost/client';
import { FetchStatus } from "src/utils/redux/types";

export interface SymbolsState {
  symbols: SymbolInfoDto[];
  status: FetchStatus;
  err: Error | null;
}

export const initialState: SymbolsState = {
  symbols: [],
  status: FetchStatus.Idle,
  err: null,
};
