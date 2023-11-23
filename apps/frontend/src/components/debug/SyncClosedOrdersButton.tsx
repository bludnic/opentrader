"use client";

import React, { FC, useEffect } from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import { useSnackbar } from "src/ui/snackbar";

const componentName = "SyncClosedOrdersButton";
const classes = {
  root: `${componentName}-root`,
};

type SyncClosedOrdersButtonProps = {
  className?: string;
  polling?: boolean;
};

export const SyncClosedOrdersButton: FC<SyncClosedOrdersButtonProps> = (
  props,
) => {
  const { className, polling } = props;
  const { showSnackbar } = useSnackbar();

  const { isLoading, mutate, mutateAsync } =
    tClient.cron.syncClosedOrders.useMutation({
      onSuccess() {
        showSnackbar("Orders have been synced");
      },
    });

  useEffect(() => {
    if (!polling) return;

    const timer = setInterval(() => {
      mutateAsync().then((data) => console.log("response", data));
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, [polling]);

  return (
    <Button
      onClick={() => mutate()}
      className={clsx(classes.root, className)}
      variant="soft"
      size="lg"
      color="warning"
      loading={isLoading}
      loadingPosition="start"
    >
      Sync closed orders
    </Button>
  );
};
