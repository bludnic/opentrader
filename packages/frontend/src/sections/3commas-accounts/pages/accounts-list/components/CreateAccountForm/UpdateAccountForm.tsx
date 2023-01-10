import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { ThreeCommasAccountDto } from "src/lib/bifrost/client";
import { useUpdateAccountMutation } from "src/sections/3commas-accounts/common/store/api";
import { AccountIdField } from "./fields/AccountIdField";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import { Button, CircularProgress, Divider, Grid } from "@mui/material";
import { UpdateAccountFormValues } from "./types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { IsPaperAccountField } from "./fields/IsPaperAccountField";
import { SecretKeyField } from "./fields/SecretKeyField";
import { SerializedError } from "@reduxjs/toolkit";
import { fromFormValuesToDto } from "./utils/update/fromFormValuesToDto";
import { styled } from "@mui/material/styles";

const componentName = "ThreeCommasUpdateAccountForm";
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

type UpdateAccountFormProps = {
  className?: string;
  onUpdated: () => void;
  onError: (error?: FetchBaseQueryError | SerializedError) => void;
  account: ThreeCommasAccountDto;
};

export const UpdateAccountForm: FC<UpdateAccountFormProps> = (props) => {
  const { className, onUpdated, onError, account } = props;

  const [updateAccount, { isLoading, isSuccess, isError, error }] =
    useUpdateAccountMutation();

  useEffect(() => {
    if (isSuccess) {
      onUpdated();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      onError(error);
    }
  }, [isError]);

  const initialValues: UpdateAccountFormValues = {
    // account
    name: account.name,

    // credentials
    apiKey: account.credentials.apiKey,
    secretKey: account.credentials.secretKey,
    isPaperAccount: account.credentials.isPaperAccount,
  };

  const handleSubmit = async (
    values: UpdateAccountFormValues,
    form: FormApi<UpdateAccountFormValues>
  ) => {
    const dto = fromFormValuesToDto(values);

    const data = await updateAccount({
      accountId: account.id,
      body: dto,
    });
    form.reset();

    return data;
  };

  const validate = (
    values: UpdateAccountFormValues
  ): Partial<Record<keyof UpdateAccountFormValues, string>> | undefined => {
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
      <Form<UpdateAccountFormValues>
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={initialValues}
        render={({ handleSubmit, submitting, values, hasValidationErrors }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <AccountIdField value={account.id} disabled />
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
                    Save
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
