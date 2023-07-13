import { Theme } from "@mui/material";
import { SxProps } from "@mui/system";
import { Checkboxes } from "mui-rff";
import React, { FC } from "react";
import { CreateAccountFormValues } from "src/sections/3commas-accounts/pages/accounts-list/components/CreateAccountForm/types";

type IsDemoAccountFieldProps = {
  className?: string;
  sx?: SxProps<Theme>;
};

const fieldName: keyof CreateAccountFormValues = "isPaperAccount";

export const IsPaperAccountField: FC<IsDemoAccountFieldProps> = (props) => {
  const { sx, className } = props;

  return (
    <Checkboxes
      className={className}
      data={{
        label: "Is Paper Account?",
        value: false,
      }}
      name={fieldName}
      required
      sx={sx}
    />
  );
};
