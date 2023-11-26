"use client";

import type { FC } from "react";
import React, { useEffect } from "react";
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
      void mutateAsync().then((data) => {
        console.log("response", data);
      });
    }, 15000);

    return () => {
      clearInterval(timer);
    };
  }, [polling]);

  return (
    <Button
      className={clsx(classes.root, className)}
      color="warning"
      loading={isLoading}
      loadingPosition="start"
      onClick={() => {
        mutate();
      }}
      size="lg"
      variant="soft"
    >
      Sync orders
    </Button>
  );
};
