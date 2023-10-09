import Button from "@mui/joy/Button";
import React, { FC, useEffect } from "react";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TExchangeAccount } from "src/types/trpc";
import { AccountIdField } from "./fields/AccountIdField";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import { UpdateExchangeAccountFormValues } from "./types";
import { ExchangeCodeField } from "./fields/ExchangeCodeField";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { IsDemoAccountField } from "./fields/IsDemoAccountField";
import { PassphraseField } from "./fields/PassphraseField";
import { SecretKeyField } from "./fields/SecretKeyField";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Divider from "@mui/joy/Divider";

type UpdateAccountFormProps = {
  onUpdated: () => void;
  onError: (error?: unknown) => void;
  account: TExchangeAccount;
  debug?: boolean;
};

export const UpdateAccountForm: FC<UpdateAccountFormProps> = (props) => {
  const { onUpdated, onError, account, debug } = props;

  const { mutateAsync, isLoading, isSuccess, isError, error } =
    trpcApi.exchangeAccount.update.useMutation();

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
    apiKey: account.apiKey,
    secretKey: account.secretKey,
    password: account.password,
    isDemoAccount: account.isDemoAccount,
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
    <Box>
      <Form<UpdateExchangeAccountFormValues>
        onSubmit={handleSubmit}
        validate={validate}
        initialValues={initialValues}
        render={({ handleSubmit, submitting, values, hasValidationErrors }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <ExchangeCodeField />
              </Grid>

              <Grid xs={12}>
                <AccountIdField value={account.id} disabled />
              </Grid>

              <Grid xs={12}>
                <AccountNameField />
              </Grid>

              <Divider />

              <Grid xs={12}>
                <ApiKeyField />
              </Grid>

              <Grid xs={12}>
                <SecretKeyField />
              </Grid>

              <Grid xs={12}>
                <PassphraseField />
              </Grid>

              <Grid xs={12}>
                <IsDemoAccountField />
              </Grid>

              <Grid container xs={12} spacing={2}>
                <Grid xs={12}>
                  <Button
                    variant="soft"
                    color="primary"
                    type="submit"
                    disabled={submitting || hasValidationErrors || isLoading}
                    startDecorator={isLoading}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {debug ? <pre>{JSON.stringify(values, null, 2)}</pre> : null}
          </form>
        )}
      />
    </Box>
  );
};
