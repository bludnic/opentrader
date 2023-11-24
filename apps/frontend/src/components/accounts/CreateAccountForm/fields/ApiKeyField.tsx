import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import type { FC } from "react";
import React from "react";
import { Field } from "react-final-form";
import type { CreateExchangeAccountFormValues } from "../types";

const fieldName: keyof CreateExchangeAccountFormValues = "apiKey";

export const ApiKeyField: FC = () => {
  return (
    <Field<string> name={fieldName}>
      {({ input }) => (
        <FormControl>
          <FormLabel>API Key</FormLabel>

          <Input
            autoComplete="off"
            name={input.name}
            onChange={input.onChange}
            required
            value={input.value}
          />
        </FormControl>
      )}
    </Field>
  );
};
