import type { FC } from "react";
import Image from "next/image";
import type { ExchangeCode } from "@opentrader/types";

const componentName = "ExchangeIcon" as const;

type Props = {
  exchangeCode: ExchangeCode;
  size?: 64 | 50;
  width?: number;
  height?: number;
};

const cdnUrl = `/exchanges/logos`;

export const ExchangeIcon: FC<Props> = ({
  exchangeCode,
  size = 64,
  width = size,
  height = size,
}) => {
  const fileName = exchangeCode.toLowerCase();
  const logoUrl = `${cdnUrl}/${size}x${size}/${fileName}.png`;

  // When using <Image/>, after building as a static app
  // image returns 404 Not Found.
  return (
    <img
      alt={exchangeCode}
      height={height}
      src={logoUrl}
      width={width}
    />
  );
};

ExchangeIcon.displayName = componentName;
