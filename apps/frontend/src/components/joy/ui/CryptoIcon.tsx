import { FC } from "react";
import Image from "next/image";

const componentName = "CryptoIcon" as const;

type Props = {
  symbol: string;
  size?: 20 | 32 | 64 | 128;
};

// Icons from here: https://github.com/ViewBlock/cryptometa
const cdnUrl = "https://meta.viewblock.io";

export const CryptoIcon: FC<Props> = ({ symbol, size = 32 }) => {
  const logoUrl = `${cdnUrl}/${symbol}/logo`;

  return (
    <Image
      src={logoUrl}
      width={size}
      height={size}
      loading="lazy"
      alt={symbol}
    />
  );
};

CryptoIcon.displayName = componentName;
