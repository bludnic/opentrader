import { TextField, TextFieldProps } from "@mui/material";
import React, { FC } from "react";
import { NumericInput } from "src/components/ui/NumericInput";
import { ISymbolFilter } from "@opentrader/types";
import { mapQuantityFilterToNumericFormatProps } from "./helpers/mapQuantityFilterToNumericFormatProps";
import { validateQuantityByFilter } from "./helpers/validateQuantityByFilter";

type QuantityInputProps = Omit<
  TextFieldProps,
  "value" | "onChange" | "InputProps" | "error" | "helperText"
> & {
  filter: ISymbolFilter;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const QuantityInput: FC<QuantityInputProps> = (props) => {
  const { value, onChange, filter, ...TextFieldProps } = props;

  const formatProps = mapQuantityFilterToNumericFormatProps(filter);
  const errorMessage = validateQuantityByFilter(value, filter);

  return (
    <TextField
      value={value}
      onChange={onChange}
      InputProps={{
        inputComponent: NumericInput as any,
        inputProps: {
          NumericFormatProps: formatProps,
        },
      }}
      error={!!errorMessage}
      helperText={errorMessage}
      {...TextFieldProps}
    />
  );
};
