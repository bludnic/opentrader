import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import Input, { InputProps } from "@mui/joy/Input";
import React, { FC } from "react";
import { ISymbolFilter } from "@opentrader/types";
import { NumericInput } from "src/components/joy/ui/NumericInput";
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

      {errorMessage ? <FormHelperText>{errorMessage}</FormHelperText> : null}
    </FormControl>
  );
};
