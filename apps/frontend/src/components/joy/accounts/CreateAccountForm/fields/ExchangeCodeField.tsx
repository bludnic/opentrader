import { ExchangeCode } from "@opentrader/types";
import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { CreateExchangeAccountFormValues } from "../types";
import { Field } from "react-final-form";

const fieldName: keyof CreateExchangeAccountFormValues = "exchangeCode";

export const ExchangeCodeField = () => {
  return (
    <Field name={fieldName}>
      {({ input }) => (
        <Select
          name={input.name}
          value={input.value}
          onChange={input.onChange}
          required
          defaultValue={ExchangeCode.OKX}
        >
          <Option value={ExchangeCode.OKX}>OKx</Option>
        </Select>
      )}
    </Field>
  );
};
