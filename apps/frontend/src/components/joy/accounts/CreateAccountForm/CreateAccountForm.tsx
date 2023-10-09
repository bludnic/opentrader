import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import React, { FC, useEffect } from "react";
import { ExchangeCode } from "@opentrader/types";
import { trpcApi } from "src/lib/trpc/endpoints";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import { CreateExchangeAccountFormValues } from "./types";
import { ExchangeCodeField } from "./fields/ExchangeCodeField";
import { Form } from "react-final-form";
import { FormApi } from "final-form";
import { IsDemoAccountField } from "./fields/IsDemoAccountField";
import { PassphraseField } from "./fields/PassphraseField";
import { SecretKeyField } from "./fields/SecretKeyField";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";

type CreateAccountFormProps = {
  onCreated: () => void;
  onError: (error?: unknown) => void;
  debug?: boolean;
};

export const CreateAccountForm: FC<CreateAccountFormProps> = (props) => {
  const { onCreated, onError, debug } = props;

  const { mutateAsync, isLoading, isSuccess, isError, error } =
    trpcApi.exchangeAccount.create.useMutation();

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
    name: "",
    exchangeCode: ExchangeCode.OKX,

    // credentials
    apiKey: "",
    secretKey: "",
    password: "",
    isDemoAccount: false,
  };

  const handleSubmit = async (
    values: CreateExchangeAccountFormValues,
    form: FormApi<CreateExchangeAccountFormValues>,
  ) => {
    const data = await mutateAsync(values);
    form.reset();

    return data;
  };

  const validate = (
    values: CreateExchangeAccountFormValues,
  ):
    | Partial<Record<keyof CreateExchangeAccountFormValues, string>>
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

    return;
  };

  return (
    <Box>
      <Form<CreateExchangeAccountFormValues>
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
                    loading={isLoading}
                  >
                    Create
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
