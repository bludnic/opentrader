import Box from "@mui/joy/Box";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import Typography from "@mui/joy/Typography";
import { FC } from "react";
import { CryptoIcon } from "src/components/joy/ui/CryptoIcon";
import { TGridBot } from "src/types/trpc";

type PairSettingListItemProps = {
  bot: TGridBot;
};

export const PairSettingListItem: FC<PairSettingListItemProps> = ({ bot }) => {
  return (
    <ListItem>
      <ListItemDecorator>
        <CurrencyBitcoinIcon />
      </ListItemDecorator>
      <ListItemContent>Pair</ListItemContent>

      <Box display="flex" alignItems="center">
        <CryptoIcon symbol={bot.baseCurrency} size={20} />
        <Typography textColor="text.tertiary" sx={{ ml: 1 }}>
          {bot.baseCurrency}/{bot.quoteCurrency}
        </Typography>
      </Box>
    </ListItem>
  );
};
