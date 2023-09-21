import { useMutation } from "@tanstack/react-query";
import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { trpc } from "src/lib/trpc";
import { TExchangeAccount } from "src/sections/exchange-accounts/common/trpc-types";
import { AccountIdField } from "./fields/AccountIdField";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import { Button, CircularProgress, Divider, Grid } from "@mui/material";
import { UpdateExchangeAccountFormValues } from "./types";
import { ExchangeCodeField } from "./fields/ExchangeCodeField";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { IsDemoAccountField } from "./fields/IsDemoAccountField";
import { PassphraseField } from "./fields/PassphraseField";
import { SecretKeyField } from "./fields/SecretKeyField";
import { styled } from "@mui/material/styles";

const componentName = "UpdateAccountForm";
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
  onError: (error?: unknown) => void;
  account: TExchangeAccount;
};

export const UpdateAccountForm: FC<UpdateAccountFormProps> = (props) => {
  const { className, onUpdated, onError, account } = props;

  const { mutateAsync, isLoading, isSuccess, isError, error } = useMutation({
    mutationFn: trpc.exchangeAccount.update.mutate,
  });

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

  const initialValues: UpdateExchangeAccountFormValues = {
    // account
    name: account.name,
    exchangeCode: account.exchangeCode,

    // credentials
    apiKey: account.credentials.apiKey,
    secretKey: account.credentials.secretKey,
    password: account.credentials.password,
    isDemoAccount: account.credentials.isDemoAccount,
  };

  const handleSubmit = async (
    values: UpdateExchangeAccountFormValues,
    form: FormApi<UpdateExchangeAccountFormValues>,
  ) => {
    const data = await mutateAsync({
      id: account.id,
      body: values,
    });

    return data;
  };

  const validate = (
    values: UpdateExchangeAccountFormValues,
  ):
    | Partial<Record<keyof UpdateExchangeAccountFormValues, string>>
    | undefined => {
    if (!values.exchangeCode) {
      return { exchangeCode: "Required" };
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

    if (!values.password) {
      return { password: "Required" };
    }

    return;
  };

  return (
    <Root className={clsx(classes.root, className)}>
      <Form<UpdateExchangeAccountFormValues>
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={initialValues}
        render={({ handleSubmit, submitting, values, hasValidationErrors }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ExchangeCodeField />
              </Grid>

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
                <PassphraseField />
              </Grid>

              <Grid item xs={12}>
                <IsDemoAccountField />
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
