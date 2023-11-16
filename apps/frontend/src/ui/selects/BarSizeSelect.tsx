"use client";

import React from "react";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { TBarSize } from "src/types/literals";
import { BarSize } from "@opentrader/types";

type BarSizeSelectProps<W extends TBarSize = TBarSize> = {
  value: W;
  onChange: (value: W) => void;
  whitelist?: readonly W[];
};

export function BarSizeSelect<T extends TBarSize = TBarSize>({
  value,
  onChange,
  whitelist,
}: BarSizeSelectProps<T>) {
  const list = whitelist || Object.values<TBarSize>(BarSize);

  return (
    <Select
      value={value}
      onChange={(e, value) => onChange(value as T)}
      required
    >
      {list.map((item) => (
        <Option value={item} key={item}>
          {item}
        </Option>
      ))}
    </Select>
  );
}
