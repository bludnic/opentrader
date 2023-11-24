import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import type { InputProps } from "@mui/joy/Input";
import Input from "@mui/joy/Input";
import type { FC } from "react";
import React from "react";
import type { ISymbolFilter } from "@opentrader/types";
import { NumericInput } from "src/ui/inputs/NumericInput";
import { mapQuantityFilterToNumericFormatProps } from "./helpers/mapQuantityFilterToNumericFormatProps";
import { validateQuantityByFilter } from "./helpers/validateQuantityByFilter";

type QuantityInputProps = Omit<
  InputProps,
  "value" | "onChange" | "slotProps"
> & {
  filter: ISymbolFilter;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
};

export const QuantityInput: FC<QuantityInputProps> = (props) => {
  const { value, onChange, filter, label, ...InputProps } = props;

  const formatProps = mapQuantityFilterToNumericFormatProps(filter);
  const errorMessage = validateQuantityByFilter(value, filter);

  return (
    <FormControl error={!!errorMessage}>
      <FormLabel>{label}</FormLabel>

      <Input
        onChange={onChange}
        slotProps={{
          input: {
            component: NumericInput,
            NumericFormatProps: formatProps,
          },
        }}
        value={value}
        {...InputProps}
      />

      {errorMessage ? <FormHelperText>{errorMessage}</FormHelperText> : null}
    </FormControl>
  );
};
