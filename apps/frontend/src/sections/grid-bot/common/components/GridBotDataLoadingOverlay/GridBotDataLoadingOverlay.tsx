import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { FC, ReactNode, useEffect } from "react";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { MainLayout } from "src/layouts/main";
import { fetchCandlesticks } from "src/store/candlesticks";
import { fetchExchangeAccounts } from "src/store/exchange-accounts";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { fetchSymbols } from "src/store/symbols";
import { FetchStatus } from "src/utils/redux/types";

const componentName = "GridBotDataLoadingOverlay";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type GridBotDataLoadingOverlayProps = {
  className?: string;
  children: ReactNode;
};

export const GridBotDataLoadingOverlay: FC<GridBotDataLoadingOverlayProps> = (
  props
) => {
  const { className, children } = props;

  const dispatch = useAppDispatch();

  const exchangeAccounts = useAppSelector(
    (rootState) => rootState.exchangeAccounts
  );
  const symbols = useAppSelector((rootState) => rootState.symbols);

  useEffect(() => {
    dispatch(fetchExchangeAccounts());
    dispatch(fetchSymbols());
  }, []);

  if (exchangeAccounts.status === FetchStatus.Loading) {
    return (
      <Root
        className={clsx(classes.root, className)}
        ContainerProps={{
          maxWidth: "sm",
          sx: {
            ml: 0, // align to left
          },
        }}
      >
        <Box display="flex" alignItems="center">
          <CircularProgress variant="indeterminate" color="primary" />

          <Typography variant="body1" ml={2}>
            Loading exchanges...
          </Typography>
        </Box>
      </Root>
    );
  }

  if (symbols.status === FetchStatus.Loading) {
    return (
      <Root
        className={clsx(classes.root, className)}
        ContainerProps={{
          maxWidth: "sm",
          sx: {
            ml: 0, // align to left
          },
        }}
      >
        <Box display="flex" alignItems="center">
          <CircularProgress variant="indeterminate" color="primary" />

          <Typography variant="body1" ml={2}>
            Loading symbols...
          </Typography>
        </Box>
      </Root>
    );
  }

  if (exchangeAccounts.status === FetchStatus.Error) {
    return (
      <Root
        className={classes.root}
        ContainerProps={{
          maxWidth: "sm",
          sx: {
            ml: 0, // align to left
          },
        }}
      >
        {exchangeAccounts.err?.message}
      </Root>
    );
  }

  if (symbols.status === FetchStatus.Error) {
    return (
      <Root
        className={classes.root}
        ContainerProps={{
          maxWidth: "sm",
          sx: {
            ml: 0, // align to left
          },
        }}
      >
        {symbols.err?.message}
      </Root>
    );
  }

  return <>{children}</>;
};
