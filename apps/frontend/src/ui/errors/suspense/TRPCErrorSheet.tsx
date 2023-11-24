"use client";

import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";
import type { FC } from "react";
import type { TRPCApiError } from "src/ui/errors/types";
import { getTRPCErrorValue } from "src/ui/errors/utils/getTrpcErrorValue";

type TRPCErrorSheetProps = {
  error: TRPCApiError;
};

export const TRPCErrorSheet: FC<TRPCErrorSheetProps> = ({ error }) => {
  const path = getTRPCErrorValue(error.data, "path");
  const stacktrace = getTRPCErrorValue(error.data, "stack");
  const httpStatus = getTRPCErrorValue(error.data, "httpStatus");
  const code = getTRPCErrorValue(error.data, "code");

  return (
    <Card>
      <Typography level="h2">{code}</Typography>
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
