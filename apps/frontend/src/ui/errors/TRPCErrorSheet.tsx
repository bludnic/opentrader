"use client";

import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import { type TRPCErrorShape } from "@trpc/server/rpc";
import { FC } from "react";
import { TTRPCErrorSchema } from "src/ui/errors/utils/trpcErrorSchema";

type TRPCErrorSheetProps = {
  error: TRPCErrorShape;
};

type ErrorData = TTRPCErrorSchema["shape"]["data"];

function getOptionalValue<K extends keyof ErrorData>(
  obj: Record<string, unknown>,
  key: K,
): ErrorData[K] | undefined {
  if (key in obj) {
    return obj[key] as ErrorData[K];
  }
}

export const TRPCErrorSheet: FC<TRPCErrorSheetProps> = ({ error }) => {
  const path = getOptionalValue(error.data, "path");
  const stacktrace = getOptionalValue(error.data, "stack");
  const httpStatus = getOptionalValue(error.data, "httpStatus");
  const code = getOptionalValue(error.data, "code");

  return (
    <Card>
      <Typography level="h2">{code ?? error.code}</Typography>
      <Typography>{error.message}</Typography>

      <Divider />

      <CardContent>
        {code ? (
          <Typography>
            <strong>Code:</strong> {code}
          </Typography>
        ) : null}

        {path ? (
          <Typography>
            <strong>Path:</strong> {path}
          </Typography>
        ) : null}

        {httpStatus ? (
          <Typography>
            <strong>HTTP Status:</strong> {httpStatus}
          </Typography>
        ) : null}

        {stacktrace ? <pre>{stacktrace}</pre> : null}
      </CardContent>
    </Card>
  );
};
