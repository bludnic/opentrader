import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { ExchangeCode } from "src/lib/bifrost/client";
import { AccountIdField } from "./fields/AccountIdField";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import { Button, CircularProgress, Divider, Grid } from "@mui/material";
import { CreateExchangeAccountFormValues } from "./types";
import { ExchangeCodeField } from "./fields/ExchangeCodeField";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { IsDemoAccountField } from "./fields/IsDemoAccountField";
import { PassphraseField } from "./fields/PassphraseField";
import { SecretKeyField } from "./fields/SecretKeyField";
import { SerializedError } from "@reduxjs/toolkit";
import { fromFormValuesToDto } from "./utils/create/fromFormValuesToDto";
import { styled } from "@mui/material/styles";
import { useCreateAccountMutation } from "src/sections/exchange-accounts/common/store/api";

const componentName = "CreateAccountForm";
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

  const initialValues: CreateExchangeAccountFormValues = {
    // account
    id: "",
    name: "",
    exchangeCode: ExchangeCode.Okx,

    // credentials
    apiKey: "",
    secretKey: "",
    passphrase: "",
    isDemoAccount: false,
  };

  const handleSubmit = async (
    values: CreateExchangeAccountFormValues,
    form: FormApi<CreateExchangeAccountFormValues>
  ) => {
    const dto = fromFormValuesToDto(values);

    const data = await createAccount(dto);
    form.reset();

    return data;
  };

  const validate = (
    values: CreateExchangeAccountFormValues
  ):
    | Partial<Record<keyof CreateExchangeAccountFormValues, string>>
    | undefined => {
    if (!values.exchangeCode) {
      return { exchangeCode: "Required" };
    }

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

    if (!values.passphrase) {
      return { passphrase: "Required" };
    }

    return;
  };

  return (
    <Root className={clsx(classes.root, className)}>
      <Form<CreateExchangeAccountFormValues>
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={initialValues}
        render={({
          handleSubmit,
          submitting,
          values,
          hasValidationErrors,
        }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <ExchangeCodeField />
              </Grid>

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
