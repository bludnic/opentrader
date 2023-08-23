import { IExchange } from "@bifrost/exchanges";
import {
  IBotConfiguration,
  IBotControl,
  SmartTradeService,
  useExchange,
  useSmartTrade,
} from "@bifrost/bot-processor";
import { computeGridFromCurrentAssetPrice } from "@bifrost/tools";
import { IGetMarketPriceResponse, IGridLine } from "@bifrost/types";

export interface GridBotConfig extends IBotConfiguration {
  gridLines: IGridLine[];
}

export function* arithmeticGridBot(control: IBotControl<GridBotConfig>) {
  const { bot } = control;

  const exchange: IExchange = yield useExchange();
  const { price }: IGetMarketPriceResponse = yield exchange.getMarketPrice({
    symbol: `${bot.baseCurrency}/${bot.quoteCurrency}`,
  });

  const gridLevels = computeGridFromCurrentAssetPrice(bot.gridLines, price);

  for (const [index, grid] of gridLevels.entries()) {
    const smartTrade: SmartTradeService = yield useSmartTrade(`${index}`, {
      buy: {
        price: grid.buy.price,
        status: grid.buy.status,
      },
      sell: {
        price: grid.sell.price,
        status: grid.sell.status,
      },
      quantity: grid.buy.quantity, // or grid.sell.quantity
    });

    if (smartTrade.isCompleted()) {
      yield smartTrade.replace();
    }
  }
}
