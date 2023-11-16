"use client";

import React, { FC } from "react";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import { AdvancedGridFormItem } from "./AdvancedGridFormItem";
import { addGridLine } from "src/store/bot-form";
import { selectGridLines } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type AdvancedGridFormProps = {
  className?: string;
};

export const AdvancedGridForm: FC<AdvancedGridFormProps> = (props) => {
  const dispatch = useAppDispatch();
  const gridLines = useAppSelector(selectGridLines);

  const handleAddGridLine = () => {
    dispatch(
      addGridLine({
        price: 1, // @todo calc from store
        quantity: 1, // @todo calc from store
      }),
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid xs={12}>
        {gridLines.map((gridLine, i) => (
          <AdvancedGridFormItem key={i} gridLineIndex={i} />
        ))}
      </Grid>

      <Grid xs={12}>
        <Button onClick={handleAddGridLine}>Add</Button>
      </Grid>
    </Grid>
  );
};
