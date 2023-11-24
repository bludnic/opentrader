"use client";

import type { FC } from "react";
import type { ImageLoader } from "next/image";
import Image from "next/image";

const componentName = "CryptoIcon" as const;

type Props = {
  symbol: string;
  size?: 20 | 32 | 64 | 128;
};

// Icons from here: https://github.com/ViewBlock/cryptometa
const cdnUrl = "https://meta.viewblock.io";

const imageLoader: ImageLoader = ({ src: symbol }) => {
  return `${cdnUrl}/${symbol}/logo`;
};

export const CryptoIcon: FC<Props> = ({ symbol, size = 32 }) => {
  return (
    <Image
      alt={symbol}
      height={size}
      loader={imageLoader}
      loading="lazy"
      src={symbol}
      width={size}
    />
  );
};

CryptoIcon.displayName = componentName;
