import { FC } from "react";
import Image from "next/image";
import { TExchangeCode } from "src/types/trpc";

const componentName = "ExchangeIcon" as const;

type Props = {
  exchangeCode: TExchangeCode;
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
      src={logoUrl}
      width={width}
      height={height}
      loading="lazy"
      alt={exchangeCode}
    />
  );
};

ExchangeIcon.displayName = componentName;
