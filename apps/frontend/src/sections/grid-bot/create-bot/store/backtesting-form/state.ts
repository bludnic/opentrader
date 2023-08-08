import startOfMonth from "date-fns/startOfMonth";
import { formatDateISO } from "src/utils/date/formatDateISO";

export interface BacktestingFormState {
  startDate: string | null; // ISO 8601 format
  endDate: string | null; // ISO 8601 format
}

startOfMonth;

export const initialState: BacktestingFormState = {
  startDate: formatDateISO(startOfMonth(new Date())),
  endDate: formatDateISO(new Date()),
};
