import { FC } from "react";
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

  return <img src={logoUrl} width={width} height={height} loading="lazy" />;
};

ExchangeIcon.displayName = componentName;
