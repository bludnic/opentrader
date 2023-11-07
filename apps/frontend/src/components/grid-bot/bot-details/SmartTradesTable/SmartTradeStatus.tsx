import Chip from "@mui/joy/Chip";
import { FC } from "react";
import { TActiveSmartTrade } from "src/types/trpc";

type SmartTradeStatusProps = {
  smartTrade: TActiveSmartTrade;
};

export const SmartTradeStatus: FC<SmartTradeStatusProps> = ({ smartTrade }) => {
  const isPositionOpen = smartTrade.entryOrder.status === "Filled";

  if (isPositionOpen) {
    return <Chip color="danger" variant="soft">Selling</Chip>;
  }

  return <Chip color="success" variant="soft">Buying</Chip>;
};
