import { ArrowBack } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import React, { FC } from "react";
import { MainLayout } from "src/layouts/main";
import { BotCard } from "src/sections/grid-bot/common/components/BotCard";
import { useGetBotsQuery } from "src/sections/grid-bot/common/store/api/botsApi";

const componentName = "GridBotsListPage";
const classes = {
  root: `${componentName}-root`,
  BotCard: `${componentName}-BotCard`,
};

const Root = styled(MainLayout)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

export const BotsListPage: FC = () => {
  const { data, error, isLoading } = useGetBotsQuery();

  if (isLoading) {
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
        <CircularProgress variant="indeterminate" color="primary" />
      </Root>
    );
  }

  if (error) {
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
        {JSON.stringify(error)}
      </Root>
    );
  }

  return (
    <Root
      className={classes.root}
      ContainerProps={{
        maxWidth: "xl",
        sx: {
          ml: 0, // align to left
        },
      }}
      DrawerProps={{
        title: "Grid Bots",
        action: (
          <Link href="/grid-bot/create" as="/grid-bot/create" passHref>
            <Button component="a">
              Create
            </Button>
          </Link>
        ),
      }}
    >
      <Grid container spacing={4}>
        <Grid item xl={6} xs={12}>
          {data?.bots.map((bot, i) => (
            <BotCard
              key={bot.id}
              bot={bot}
              sx={{ marginTop: i !== 0 ? "32px" : undefined }}
            />
          ))}
        </Grid>
      </Grid>
    </Root>
  );
};
