"use client";

import React from "react";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { BarSize } from "@opentrader/types";

type BarSizeSelectProps<W extends BarSize = BarSize> = {
  value: W;
  onChange: (value: W) => void;
  whitelist?: readonly W[];
};

export function BarSizeSelect<T extends BarSize = BarSize>({
  value,
  onChange,
  whitelist,
}: BarSizeSelectProps<T>) {
  const list = whitelist || Object.values<BarSize>(BarSize);

  return (
    <Select
      onChange={(e, value) => {
        onChange(value!);
      }}
      required
      value={value}
    >
      {list.map((item) => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
  );
}
