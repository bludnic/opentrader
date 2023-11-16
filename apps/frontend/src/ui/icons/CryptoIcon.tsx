"use client";

import { FC } from "react";
import Image, { ImageLoader } from "next/image";

const componentName = "CryptoIcon" as const;

type Props = {
  symbol: string;
  size?: 20 | 32 | 64 | 128;
};

// Icons from here: https://github.com/ViewBlock/cryptometa
const cdnUrl = "https://meta.viewblock.io";

const imageLoader: ImageLoader = ({ src: symbol, width, quality }) => {
  return `${cdnUrl}/${symbol}/logo`;
};

export const CryptoIcon: FC<Props> = ({ symbol, size = 32 }) => {
  return (
    <Image
      loader={imageLoader}
      src={symbol}
      width={size}
      height={size}
      loading="lazy"
      alt={symbol}
    />
  );
};

CryptoIcon.displayName = componentName;
