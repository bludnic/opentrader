import { FC } from "react";

import { styled } from "@mui/material/styles";
import clsx from "clsx";

const componentName = "EditBotForm";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type EditBotFormProps = {
  className?: string;
};

export const GridBotChart: FC<EditBotFormProps> = (props) => {
  const { className } = props;

  return (
    <Root className={clsx(classes.root, className)}>

    </Root>
  );
};
