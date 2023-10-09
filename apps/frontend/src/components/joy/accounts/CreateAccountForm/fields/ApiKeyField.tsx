import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import React, { FC } from "react";
import { Field } from "react-final-form";
import { CreateExchangeAccountFormValues } from "../types";

const fieldName: keyof CreateExchangeAccountFormValues = "apiKey";

export const ApiKeyField: FC = () => {
  return (
    <Field name={fieldName}>
      {({ input }) => (
        <FormControl>
          <FormLabel>API Key</FormLabel>

          <Input
            name={input.name}
            value={input.value}
            onChange={input.onChange}
            required
            autoComplete="off"
          />
        </FormControl>
      )}
    </Field>
  );
};
