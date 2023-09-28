import { NextPage } from "next";
import {
  getStaticPropsCoinMarketCapCoins,
  GetStaticPropsCoinMarketCapCoinsProps,
} from "src/utils/next/getStaticPropsCoinMarketCapCoins";
import { CoinsCombobox } from "src/components/ui/CoinsListCombobox";

type Props = {} & GetStaticPropsCoinMarketCapCoinsProps;

const Cryptocurrencies: NextPage<Props> = (props) => {
  const { coins } = props;

  return (
    <div>
      <CoinsCombobox coins={coins} />
    </div>
  );
};

export default Cryptocurrencies;

export const getStaticProps = getStaticPropsCoinMarketCapCoins;
