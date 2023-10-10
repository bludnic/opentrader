import React, { FC, ReactNode } from "react";
import { ExchangeCode } from "@opentrader/types";
import Autocomplete from "@mui/joy/Autocomplete";
import { ListboxComponent } from "./LisboxComponent";
import { renderOption } from "./renderOption";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TExchangeCode, TSymbol } from "src/types/trpc";

export type CryptoCoinSelectProps = {
  exchangeCode: TExchangeCode;
  value: TSymbol | null;
  onChange: (value: TSymbol | null) => void;
};

export const CryptoCoinSelect: FC<CryptoCoinSelectProps> = ({
  exchangeCode,
  value,
  onChange,
}) => {
  const { data, isLoading, isError, error } = trpcApi.symbol.list.useQuery({
    input: exchangeCode as ExchangeCode, // @todo tRPC: change enum to string literal on backend API
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>An error happened: {JSON.stringify(error)}</>;
  }

  return (
    <Autocomplete
      value={value}
      onChange={(e, value) => onChange(value)}
      disableListWrap
      options={data}
      slots={{
        listbox: ListboxComponent,
      }}
      getOptionLabel={(option) => option.symbolId}
      // Actually it doesn't return ReactNode, but an array
      // with: option's `HTMLElement`, option data, `state` and `ownerState`.
      // Check `renderOption()` params for more details.
      // To make TS happy the return type will be marked as ReactNode.
      renderOption={(...props) => renderOption(...props) as ReactNode}
    />
  );
};

CryptoCoinSelect.displayName = "CryptoCoinSelect";
