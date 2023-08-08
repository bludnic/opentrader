import { BarSize, IGridLine } from "@bifrost/types";
import {
  DEFAULT_GRID_LINES_NUMBER,
  DEFAULT_QUANTITY_PER_GRID,
} from "./constants";
import { GridBotFormType } from "./types";

export interface GridBotFormState {
  type: GridBotFormType;

  // Common options
  exchangeAccountId: string;
  currencyPair: string;

  // Simple options
  highPrice: number;
  lowPrice: number;
  gridLinesNumber: number;
  quantityPerGrid: string;

  // Advanced options
  gridLines: IGridLine[];

  barSize: BarSize;
}

export const initialState: GridBotFormState = {
  type: "simple",

  // @todo rehardcore default values
  exchangeAccountId: "",
  currencyPair: "",

  highPrice: 0,
  lowPrice: 0,
  gridLinesNumber: DEFAULT_GRID_LINES_NUMBER,
  quantityPerGrid: `${DEFAULT_QUANTITY_PER_GRID}`,

  gridLines: [],

  barSize: BarSize.ONE_HOUR,
};
