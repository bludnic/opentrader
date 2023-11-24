import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import type { FC } from "react";
import React from "react";
import { Field } from "react-final-form";
import type { CreateExchangeAccountFormValues } from "../types";

const fieldName: keyof CreateExchangeAccountFormValues = "password";

export const PassphraseField: FC = () => {
  return (
    <Field<string> name={fieldName}>
      {({ input }) => (
        <FormControl>
          <FormLabel>Password</FormLabel>

          <Input
            autoComplete="off"
            name={input.name}
            onChange={input.onChange}
            value={input.value}
          />
        </FormControl>
      )}
    </Field>
  );
};
