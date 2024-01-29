import Box from "@mui/joy/Box";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import Typography from "@mui/joy/Typography";
import type { FC } from "react";
import { CryptoIcon } from "src/ui/icons/CryptoIcon";
import type { TBot } from "src/types/trpc";

type PairSettingListItemProps = {
  bot: TBot;
};

export const PairSettingListItem: FC<PairSettingListItemProps> = ({ bot }) => {
  return (
    <ListItem>
      <ListItemDecorator>
        <CurrencyBitcoinIcon />
      </ListItemDecorator>
      <ListItemContent>Pair</ListItemContent>

      <Box alignItems="center" display="flex">
        <CryptoIcon size={20} symbol={bot.baseCurrency} />
        <Typography sx={{ ml: 1 }} textColor="text.tertiary">
          {bot.baseCurrency}/{bot.quoteCurrency}
        </Typography>
      </Box>
    </ListItem>
  );
};
