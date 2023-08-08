import React, { FC } from "react";
import { Button, Divider, Grid } from '@mui/material';
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { AdvancedGridFormItem } from "./AdvancedGridFormItem";
import { addGridLine } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectGridLines } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

const componentName = "AdvancedGridForm";
const classes = {
  root: `${componentName}-root`,
  field: `${componentName}-field`,
};
const Root = styled(Grid)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`& .${classes.field}`]: {
    marginTop: 16,
  },
}));

type AdvancedGridFormProps = {
  className?: string;
};

export const AdvancedGridForm: FC<AdvancedGridFormProps> = (props) => {
  const { className } = props;
  const dispatch = useAppDispatch();
  const gridLines = useAppSelector(selectGridLines);

  const handleAddGridLine = () => {
    dispatch(
      addGridLine({
        price: 1, // @todo calc from store
        quantity: 1, // @todo calc from store
      })
    );
  };

  return (
    <Root className={clsx(classes.root, className)} container spacing={2}>
      <Grid item xs={12}>
        <Divider>Advanced settings</Divider>
      </Grid>

      <Grid container item xs={12} spacing={2}>
        {gridLines.map((gridLine, i) => (
          <AdvancedGridFormItem key={i} gridLineIndex={i} />
        ))}

        <Grid item xs={12}>
          <Button onClick={handleAddGridLine}>Add</Button>
        </Grid>
      </Grid>
    </Root>
  );
};
