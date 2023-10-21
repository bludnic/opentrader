import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input, { InputProps } from "@mui/joy/Input";
import React, { FC } from "react";
import { ISymbolFilter } from "@opentrader/types";
import { NumericInput } from "src/components/joy/ui/NumericInput";
import { mapPriceFilterToNumericFormatProps } from "./helpers/mapPriceFilterToNumericFormatProps";
import { validatePriceByFilter } from "./helpers/validatePriceByFilter";

type PriceInput = Omit<InputProps, "value" | "onChange" | "slotProps"> & {
  filter: ISymbolFilter;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export const PriceInput: FC<PriceInput> = (props) => {
  const { value, onChange, filter, label, ...InputProps } = props;

  const formatProps = mapPriceFilterToNumericFormatProps(filter);
  const errorMessage = validatePriceByFilter(value, filter);

  return (
    <FormControl error={!!errorMessage}>
      <FormLabel>{label}</FormLabel>

      <Input
        value={value}
        onChange={onChange}
        slotProps={{
          input: {
            component: NumericInput,
            NumericFormatProps: formatProps,
          },
        }}
        {...InputProps}
      />

      <FormHelperText>{errorMessage}</FormHelperText>
    </FormControl>
  );
};
