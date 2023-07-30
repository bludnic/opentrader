import { NumericFormatProps } from "react-number-format";
import { SymbolFilterDto } from 'src/lib/bifrost/client';
import { getExponentAbs } from "src/utils/currency/numbers/getExponentAbs";

export function mapPriceFilterToNumericFormatProps(
  filter: SymbolFilterDto
): Pick<NumericFormatProps, "decimalScale"> {
  return {
    decimalScale: getExponentAbs(filter.price.tickSize),
  };
}
