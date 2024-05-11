import { ExchangeCode } from "@opentrader/types";
import React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Field } from "react-final-form";
import type { CreateExchangeAccountFormValues } from "../types";

const fieldName: keyof CreateExchangeAccountFormValues = "exchangeCode";

const exchangeCodes = Object.values(ExchangeCode);

export function ExchangeCodeField() {
  return (
    <Field<ExchangeCode> name={fieldName}>
      {({ input }) => (
        <Select
          defaultValue={ExchangeCode.OKX}
          name={input.name}
          onChange={(e, newValue) => input.onChange(newValue)}
          required
          value={input.value}
        >
          {exchangeCodes.map((exchangeCode) => (
            <Option value={exchangeCode} key={exchangeCode}>
              {exchangeCode}
            </Option>
          ))}
        </Select>
      )}
    </Field>
  );
}
