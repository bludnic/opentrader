import React, { FC } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Select } from "@mui/material";
import { useSymbols } from "src/sections/grid-bot/create-bot/hooks/useSymbols";
import { changeSymbolId } from "src/sections/grid-bot/create-bot/store/bot-form";
import { selectSymbolId } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type PairFieldProps = {
  className?: string;
};

export const PairField: FC<PairFieldProps> = (props) => {
  const { className } = props;

  const labelText = "Pair";
  const labelId = "pair-symbol";

  const dispatch = useAppDispatch();
  const symbols = useSymbols();

  const value = useAppSelector(selectSymbolId);
  const handleChange = (e: SelectChangeEvent<string>) => {
    dispatch(changeSymbolId(e.target.value));
  };

  return (
    <FormControl className={className} required fullWidth>
      <InputLabel id={labelId}>{labelText}</InputLabel>

      <Select
        className={className}
        label={labelText}
        labelId={labelId}
        value={value}
        onChange={handleChange}
        maxRows={10}
      >
        {symbols.map((symbol) => (
          <MenuItem key={symbol.symbolId} value={symbol.symbolId}>
            {symbol.symbolId}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
