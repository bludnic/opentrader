import { GetStaticProps } from "next";
import { coinMarketCapApi } from "src/lib/coinmarketcap/apiClient";
import { Coin } from "src/components/ui/CoinsListCombobox/types";

export type GetStaticPropsCoinMarketCapCoinsProps = {
  coins: Coin[];
};

export const getStaticPropsCoinMarketCapCoins: GetStaticProps<
  GetStaticPropsCoinMarketCapCoinsProps
> = async () => {
  const { data } = await coinMarketCapApi.getCryptocurrencyMap();
  const normalizedCoins: Coin[] = data.data.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
  }));

  return {
    props: {
      coins: normalizedCoins,
    },
  };
};
