"use client";

import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import type { FC } from "react";

type UnknownErrorSheetProps = {
  error: unknown;
};

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export const UnknownErrorSheet: FC<UnknownErrorSheetProps> = ({ error }) => {
  if (isError(error)) {
    return (
      <Card>
        <Typography level="h2">An error occurred</Typography>
        <Typography>{error.message}</Typography>
      </Card>
    );
  }

  return (
    <Card>
      <Typography level="h2">An error occurred</Typography>
      <Typography>JSON: {JSON.stringify(error)}</Typography>
    </Card>
  );
};
