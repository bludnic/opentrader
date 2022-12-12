import { GetStaticProps } from "next";
import { coingeckoApi } from "src/lib/coingecko/apiClient";
import { Coin } from "src/components/ui/CoinsListCombobox/types";

export type GetStaticPropsCoingeckoCoinsListProps = {
  coins: Coin[];
};

export const getStaticPropsCoinGeckoCoinsList: GetStaticProps<
  GetStaticPropsCoingeckoCoinsListProps
> = async () => {
  const { data } = await coingeckoApi.getCoinsList();

  const normalizedCoins: Coin[] = data
    .map((coin, i) => ({
      id: i,
      name: coin.name || "",
      symbol: coin.symbol || "",
    }))
    .filter((coin) => coin.name.length > 0 && coin.symbol.length > 0);

  return {
    props: {
      coins: normalizedCoins,
    },
  };
};
