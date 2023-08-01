import { TextField, TextFieldProps } from "@mui/material";
import React, { FC } from "react";
import { NumericInput } from "src/components/ui/NumericInput";
import { SymbolFilterDto } from "src/lib/bifrost/client";
import { mapPriceFilterToNumericFormatProps } from "./helpers/mapPriceFilterToNumericFormatProps";
import { validatePriceByFilter } from "./helpers/validatePriceByFilter";

type PriceInput = Omit<
  TextFieldProps,
  "value" | "onChange" | "InputProps" | "error" | "helperText"
> & {
  filter: SymbolFilterDto;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PriceInput: FC<PriceInput> = (props) => {
  const { value, onChange, filter, ...TextFieldProps } = props;

  const formatProps = mapPriceFilterToNumericFormatProps(filter);
  const errorMessage = validatePriceByFilter(value, filter);

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
