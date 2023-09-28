import { ExchangeCode } from "@bifrost/types";
import { Select, ShowErrorFunc } from "mui-rff";
import {
  MenuItem,
  SxProps,
  TextFieldProps as MuiTextFieldProps,
  Theme,
} from "@mui/material";

import React, { FC } from "react";
import { FieldProps } from "react-final-form";
import { CreateExchangeAccountFormValues } from "src/sections/exchange-accounts/pages/accounts-list/components/CreateAccountForm/types";

export type ExchangeCodeFieldProps = Partial<
  Omit<MuiTextFieldProps, "type" | "onChange">
> & {
  fieldProps?: Partial<FieldProps<any, any>>;
  showError?: ShowErrorFunc;
  sx?: SxProps<Theme>;

  className?: string;
};

const fieldName: keyof CreateExchangeAccountFormValues = "exchangeCode";

export const ExchangeCodeField: FC<ExchangeCodeFieldProps> = (props) => {
  const { sx, className } = props;

  return (
    <Select
      label="Exchange"
      name={fieldName}
      required={true}
      sx={sx}
      className={className}
    >
      <MenuItem value={ExchangeCode.OKX}>OKx</MenuItem>
    </Select>
  );
};
