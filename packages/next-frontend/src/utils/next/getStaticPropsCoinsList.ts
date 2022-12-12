import { GetStaticProps } from "next";
import { CoinsListReply } from "src/lib/coingecko/client";
import { coingeckoApi } from "src/lib/coingecko/apiClient";

export type GetStaticPropsCoinsListProps = {
  coins: CoinsListReply[];
};

export const getStaticPropsCoinsList: GetStaticProps<
  GetStaticPropsCoinsListProps
> = async () => {
  const { data } = await coingeckoApi.getCoinsList();

  return {
    props: {
      coins: data,
    },
  };
};
