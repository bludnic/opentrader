import type { NumericFormatProps } from "react-number-format";
import { getExponentAbs } from "@opentrader/tools";
import type { ISymbolFilter } from "@opentrader/types";

export function mapPriceFilterToNumericFormatProps(
  filter: ISymbolFilter,
): Pick<NumericFormatProps, "decimalScale"> {
  return {
    decimalScale: filter.decimals.price,
  };
}
