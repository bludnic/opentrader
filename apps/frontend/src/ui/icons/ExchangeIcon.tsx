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

  return (
    <Image
      alt={exchangeCode}
      height={height}
      loading="lazy"
      src={logoUrl}
      width={width}
    />
  );
};

ExchangeIcon.displayName = componentName;
