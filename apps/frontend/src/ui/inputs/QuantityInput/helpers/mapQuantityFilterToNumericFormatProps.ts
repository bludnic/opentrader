import type { NumericFormatProps } from "react-number-format";
import type { ISymbolFilter } from "@opentrader/types";
import { getExponentAbs } from "@opentrader/tools";

export function mapQuantityFilterToNumericFormatProps(
  filter: ISymbolFilter,
): Pick<NumericFormatProps, "decimalScale"> {
  return {
    decimalScale: getExponentAbs(filter.lot.stepSize),
  };
}
