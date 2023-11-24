import Button from "@mui/joy/Button";
import type { FC } from "react";
import React, { useEffect } from "react";
import { Form } from "react-final-form";
import type { FormApi } from "final-form";
import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Divider from "@mui/joy/Divider";
import { tClient } from "src/lib/trpc/client";
import type { TExchangeAccount } from "src/types/trpc";
import { AccountIdField } from "./fields/AccountIdField";
import { AccountNameField } from "./fields/AccountNameField";
import { ApiKeyField } from "./fields/ApiKeyField";
import type { UpdateExchangeAccountFormValues } from "./types";
import { ExchangeCodeField } from "./fields/ExchangeCodeField";
import { IsDemoAccountField } from "./fields/IsDemoAccountField";
import { PassphraseField } from "./fields/PassphraseField";
import { SecretKeyField } from "./fields/SecretKeyField";

type UpdateAccountFormProps = {
  onUpdated: () => void;
  onError: (error?: unknown) => void;
  account: TExchangeAccount;
  debug?: boolean;
};

export const UpdateAccountForm: FC<UpdateAccountFormProps> = (props) => {
  const { onUpdated, onError, account, debug } = props;

  const { mutateAsync, isLoading, isSuccess, isError, error } =
    tClient.exchangeAccount.update.useMutation();

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
    _form: FormApi<UpdateExchangeAccountFormValues>,
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- it may be empty string
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
  };

  return (
    <Box>
      <Form<UpdateExchangeAccountFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        render={({ handleSubmit, submitting, values, hasValidationErrors }) => (
          <form noValidate onSubmit={() => void handleSubmit()}>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <ExchangeCodeField />
              </Grid>

              <Grid xs={12}>
                <AccountIdField disabled value={account.id} />
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
                    startDecorator={isLoading}
                    type="submit"
                    variant="soft"
                  >
                    Save
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
