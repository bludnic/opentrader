import { NumericFormatProps } from "react-number-format";
import { SymbolFilterDto } from 'src/lib/bifrost/client';
import { getExponentAbs } from "@bifrost/tools";

export function mapPriceFilterToNumericFormatProps(
  filter: SymbolFilterDto
): Pick<NumericFormatProps, "decimalScale"> {
  return {
    decimalScale: getExponentAbs(filter.price.tickSize),
  };
}
