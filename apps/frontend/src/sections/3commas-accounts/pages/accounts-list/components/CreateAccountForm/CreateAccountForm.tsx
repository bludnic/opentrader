import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { useCreateAccountMutation } from "src/sections/3commas-accounts/common/store/api";
import { CreateAccountFormValues } from "src/sections/3commas-accounts/pages/accounts-list/components/CreateAccountForm/types";
import { AccountIdField } from "./fields/AccountIdField";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import { Button, CircularProgress, Divider, Grid } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { SecretKeyField } from "./fields/SecretKeyField";
import { IsPaperAccountField } from "./fields/IsPaperAccountField";
import { SerializedError } from "@reduxjs/toolkit";
import { fromFormValuesToDto } from "./utils/create/fromFormValuesToDto";
import { styled } from "@mui/material/styles";

const componentName = "ThreeCommasCreateAccountForm";
const classes = {
  root: `${componentName}-root`,
  field: `${componentName}-field`,
};
const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`& .${classes.field}`]: {
    marginTop: 16,
  },
}));

type CreateAccountFormProps = {
  className?: string;
  onCreated: () => void;
  onError: (error?: FetchBaseQueryError | SerializedError) => void;
};

export const CreateAccountForm: FC<CreateAccountFormProps> = (props) => {
  const { className, onCreated, onError } = props;

  const [createAccount, { isLoading, isSuccess, isError, error }] =
    useCreateAccountMutation();

  useEffect(() => {
    if (isSuccess) {
      onCreated();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      onError(error);
    }
  }, [isError]);

  const initialValues: CreateAccountFormValues = {
    // account
    id: "",
    name: "",

    // credentials
    apiKey: "",
    secretKey: "",
    isPaperAccount: false,
  };

  const handleSubmit = async (
    values: CreateAccountFormValues,
    form: FormApi<CreateAccountFormValues>
  ) => {
    const dto = fromFormValuesToDto(values);

    const data = await createAccount(dto);
    form.reset();

    return data;
  };

  const validate = (
    values: CreateAccountFormValues
  ): Partial<Record<keyof CreateAccountFormValues, string>> | undefined => {
    if (!values.id) {
      return { id: "Required" };
    }

    if (!values.name) {
      return { name: "Required" };
    }

    if (!values.apiKey) {
      return { apiKey: "Required" };
    }

    if (!values.secretKey) {
      return { secretKey: "Required" };
    }

    return;
  };

  return (
    <Root className={clsx(classes.root, className)}>
      <Form<CreateAccountFormValues>
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={initialValues}
        render={({ handleSubmit, submitting, values, hasValidationErrors }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AccountIdField />
              </Grid>

              <Grid item xs={12}>
                <AccountNameField />
              </Grid>

              <Divider />

              <Grid item xs={12}>
                <ApiKeyField />
              </Grid>

              <Grid item xs={12}>
                <SecretKeyField />
              </Grid>

              <Grid item xs={12}>
                <IsPaperAccountField />
              </Grid>

              <Grid container item xs={12} spacing={2}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting || hasValidationErrors || isLoading}
                    startIcon={
                      isLoading ? (
                        <CircularProgress variant="indeterminate" size={18} />
                      ) : null
                    }
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <pre>{JSON.stringify(values, null, 2)}</pre>
          </form>
        )}
      />
    </Root>
  );
};
