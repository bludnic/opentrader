import React, { FC } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { CreateExchangeAccountFormValues } from "../types";
import { Field } from "react-final-form";

const fieldName: keyof CreateExchangeAccountFormValues = "name";

export const AccountNameField: FC = () => {
  return (
    <Field name={fieldName}>
      {({ input }) => (
        <FormControl>
          <FormLabel>Account name</FormLabel>

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
