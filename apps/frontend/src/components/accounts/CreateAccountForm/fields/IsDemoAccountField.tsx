import type { FC } from "react";
import React from "react";
import Checkbox from "@mui/joy/Checkbox";
import { Field } from "react-final-form";
import type { CreateExchangeAccountFormValues } from "../types";

const fieldName: keyof CreateExchangeAccountFormValues = "isDemoAccount";

export const IsDemoAccountField: FC = () => {
  return (
    <Field name={fieldName} type="checkbox">
      {({ input }) => (
        <Checkbox
          checked={input.checked}
          label="Is Demo Account?"
          name={input.name}
          onChange={input.onChange}
        />
      )}
    </Field>
  );
};
