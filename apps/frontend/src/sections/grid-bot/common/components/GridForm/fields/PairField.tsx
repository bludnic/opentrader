import React, { FC } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Select } from "@mui/material";
import { changeSymbolId } from "src/sections/grid-bot/create-bot/store/bot-form";
import {
  selectExchangeCode,
  selectSymbolId
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { selectSymbols } from 'src/store/rtk/getSymbols/selectors';

type PairFieldProps = {
  className?: string;
};

export const PairField: FC<PairFieldProps> = (props) => {
  const { className } = props;

  const labelText = "Pair";
  const labelId = "pair-symbol";

  const dispatch = useAppDispatch();
  const exchangeCode = useAppSelector(selectExchangeCode);
  const symbols = useAppSelector(selectSymbols(exchangeCode));

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
