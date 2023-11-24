import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import type { FC } from "react";
import React, { useEffect } from "react";
import { ExchangeCode } from "@opentrader/types";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import type { CreateExchangeAccountFormValues } from "./types";
import { ExchangeCodeField } from "./fields/ExchangeCodeField";
import { IsDemoAccountField } from "./fields/IsDemoAccountField";
import { PassphraseField } from "./fields/PassphraseField";
import { SecretKeyField } from "./fields/SecretKeyField";

type CreateAccountFormProps = {
  onCreated: () => void;
  onError: (error?: unknown) => void;
  debug?: boolean;
};

export const CreateAccountForm: FC<CreateAccountFormProps> = (props) => {
  const { onCreated, onError, debug } = props;

  const { mutateAsync, isLoading, isSuccess, isError, error } =
    tClient.exchangeAccount.create.useMutation();

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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- it can be an empty string
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
  };

  return (
    <Box>
      <Form<CreateExchangeAccountFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, submitting, values, hasValidationErrors }) => (
          <form noValidate onSubmit={() => void handleSubmit()}>
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

              <Grid container spacing={2} xs={12}>
                <Grid xs={12}>
                  <Button
                    color="primary"
                    disabled={submitting || hasValidationErrors || isLoading}
                    loading={isLoading}
                    type="submit"
                    variant="soft"
                  >
                    Create
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {debug ? <pre>{JSON.stringify(values, null, 2)}</pre> : null}
          </form>
        )}
        validate={validate}
      />
    </Box>
  );
};
