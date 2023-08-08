import { Code } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import Link from "next/link";

const componentName = "Logo";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {
    width: '100%',

    "& a": {
      textDecoration: "none",
      color: theme.palette.primary.main,
      display: "flex",
      alignItems: "center",
    },
  },
}));

type LogoProps = {
  className?: string;
};

export const Logo: FC<LogoProps> = (props) => {
  const { className } = props;

  return (
    <Root className={clsx(classes.root, className)}>
      <Link href="/grid-bot" passHref>
        <a>
          <Code fontSize="large" />
          <Typography variant="h5" fontWeight="bold" sx={{ ml: 2 }}>0x6502</Typography>
        </a>
      </Link>
    </Root>
  );
};
