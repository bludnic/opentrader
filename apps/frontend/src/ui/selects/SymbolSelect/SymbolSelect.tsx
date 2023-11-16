"use client";

import React, { FC, ReactNode, useState } from "react";
import { ExchangeCode } from "@opentrader/types";
import Autocomplete from "@mui/joy/Autocomplete";
import { tClient } from "src/lib/trpc/client";
import { ListboxComponent } from "./LisboxComponent";
import { renderOption } from "./renderOption";
import { TExchangeCode, TSymbol } from "src/types/trpc";

export type CryptoCoinSelectProps = {
  exchangeCode: TExchangeCode;
  value: TSymbol | null;
  onChange: (value: TSymbol | null) => void;
  defaultSymbols?: TSymbol[];
};

const getOptionLabel = (symbol: TSymbol) => symbol.symbolId;

export const SymbolSelect: FC<CryptoCoinSelectProps> = ({
  exchangeCode,
  value,
  onChange,
  defaultSymbols,
}) => {
  const [inputValue, setInputValue] = useState(
    value ? getOptionLabel(value) : "",
  );

  const [data] = defaultSymbols
    ? [defaultSymbols]
    : tClient.symbol.list.useSuspenseQuery(exchangeCode as ExchangeCode);

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={(_e, value) => setInputValue(value)}
      value={value}
      onChange={(e, value) => onChange(value)}
      disableListWrap
      options={data}
      slots={{
        listbox: ListboxComponent,
      }}
      getOptionLabel={getOptionLabel}
      // Actually it doesn't return ReactNode, but an array
      // with: option's `HTMLElement`, option data, `state` and `ownerState`.
      // Check `renderOption()` params for more details.
      // To make TS happy the return type will be marked as ReactNode.
      renderOption={(...props) => renderOption(...props) as ReactNode}
    />
  );
};

SymbolSelect.displayName = "SymbolSelect";
