import React, { FC } from "react";
import Checkbox from "@mui/joy/Checkbox";
import { CreateExchangeAccountFormValues } from "../types";
import { Field } from "react-final-form";

const fieldName: keyof CreateExchangeAccountFormValues = "isDemoAccount";

export const IsDemoAccountField: FC = () => {
  return (
    <Field name={fieldName} type="checkbox">
      {({ input }) => (
        <Checkbox
          name={input.name}
          checked={input.checked}
          onChange={input.onChange}
          label="Is Demo Account?"
        />
      )}
    </Field>
  );
};
