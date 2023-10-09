import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import React, { FC } from "react";
import { Field } from "react-final-form";
import { CreateExchangeAccountFormValues } from "../types";

const fieldName: keyof CreateExchangeAccountFormValues = "secretKey";

export const SecretKeyField: FC = () => {
  return (
    <Field name={fieldName}>
      {({ input }) => (
        <FormControl>
          <FormLabel>Secret key</FormLabel>

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
