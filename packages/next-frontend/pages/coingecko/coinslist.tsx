import { NextPage } from "next";
import {
  getStaticPropsCoinsList,
  GetStaticPropsCoinsListProps,
} from "src/utils/next/getStaticPropsCoinsList";
import { CoinsCombobox } from "src/components/ui/CoinsListCombobox";

type Props = {} & GetStaticPropsCoinsListProps;

const CoinsListNextPage: NextPage<Props> = (props) => {
  const { coins } = props;

  return (
    <div>
      <CoinsCombobox coins={coins} />
    </div>
  );
};

export default CoinsListNextPage;

export const getStaticProps = getStaticPropsCoinsList;
