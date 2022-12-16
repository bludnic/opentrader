import { NextPage } from "next";
import {
  getStaticPropsCoinGeckoCoinsList,
  GetStaticPropsCoingeckoCoinsListProps,
} from "src/utils/next/getStaticPropsCoinGeckoCoinsList";
import { CoinsCombobox } from "src/components/ui/CoinsListCombobox";

type Props = {} & GetStaticPropsCoingeckoCoinsListProps;

const CoinsListNextPage: NextPage<Props> = (props) => {
  const { coins } = props;

  return (
    <div>
      <CoinsCombobox coins={coins} />
    </div>
  );
};

export default CoinsListNextPage;

export const getStaticProps = getStaticPropsCoinGeckoCoinsList;
