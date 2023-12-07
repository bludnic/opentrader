import type { FC } from "react";
import { Price } from "./Price";
import { PriceChange } from "./PriceChange";

type Props = {
  open: number;
  high: number;
  low: number;
  close: number;
};

export const Ohlc: FC<Props> = ({ open, high, low, close }) => {
  const color = close < open ? "danger" : "success";

  return (
    <>
      <Price color={color} prefix="O" price={open} />
      <Price color={color} prefix="H" price={high} />
      <Price color={color} prefix="L" price={low} />
      <Price color={color} prefix="C" price={close} />

      <PriceChange close={close} color={color} open={open} />
    </>
  );
};
