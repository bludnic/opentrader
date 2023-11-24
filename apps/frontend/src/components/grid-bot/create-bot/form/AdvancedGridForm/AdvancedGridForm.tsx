"use client";

import type { FC } from "react";
import React from "react";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button";
import { addGridLine } from "src/store/bot-form";
import { selectGridLines } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { AdvancedGridFormItem } from "./AdvancedGridFormItem";

export const AdvancedGridForm: FC = () => {
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
          <AdvancedGridFormItem gridLineIndex={i} key={i} />
        ))}
      </Grid>

      <Grid xs={12}>
        <Button onClick={handleAddGridLine}>Add</Button>
      </Grid>
    </Grid>
  );
};
