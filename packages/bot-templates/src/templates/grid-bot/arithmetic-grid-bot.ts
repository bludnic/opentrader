import { IExchange } from "@opentrader/exchanges";
import {
  cancelSmartTrade,
  IBotConfiguration,
  SmartTradeService,
  TBotContext,
  useExchange,
  useSmartTrade,
} from "@opentrader/bot-processor";
import { computeGridFromCurrentAssetPrice } from "@opentrader/tools";
import {
  IGetMarketPriceResponse,
  IGridBotLevel,
  IGridLine,
} from "@opentrader/types";

export interface GridBotConfig extends IBotConfiguration {
  gridLines: IGridLine[];
}

export function* arithmeticGridBot(ctx: TBotContext<GridBotConfig>) {
  const { config: bot, onStart, onStop } = ctx;

  const exchange: IExchange = yield useExchange();

  let price = 0;
  if (onStart) {
    const { price: markPrice }: IGetMarketPriceResponse =
      yield exchange.getMarketPrice({
        symbol: `${bot.baseCurrency}/${bot.quoteCurrency}`,
      });
    price = markPrice;
    console.log(`[GridBotTemple] Bot started [markPrice: ${price}]`);
  }

  const gridLevels: IGridBotLevel[] = computeGridFromCurrentAssetPrice(
    bot.gridLines,
    price,
  );

  if (onStop) {
    for (const [index, grid] of gridLevels.entries()) {
      yield cancelSmartTrade(`${index}`);
    }

    return;
  }

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
