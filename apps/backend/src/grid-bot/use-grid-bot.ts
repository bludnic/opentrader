import { IExchange } from '@bifrost/exchanges';
import {
  IBotControl,
  SmartTrade,
  useSmartTrade,
  useExchange,
} from '@bifrost/bot-processor';
import { OrderStatusEnum, IGetMarketPriceResponse } from '@bifrost/types';
import { computeGridFromCurrentAssetPrice } from '@bifrost/tools';
import { GridBotEntity } from 'src/core/db/types/entities/grid-bots/grid-bot.entity';

export function* useGridBot(control: IBotControl<GridBotEntity>) {
  const { bot } = control;

  const exchange: IExchange = yield useExchange();
  const { price }: IGetMarketPriceResponse = yield exchange.getMarketPrice({
    symbol: `${bot.baseCurrency}/${bot.quoteCurrency}`,
  });
  const gridLevels = computeGridFromCurrentAssetPrice(bot.gridLines, price);

  for (const [index, grid] of gridLevels.entries()) {
    const smartTrade: SmartTrade = yield useSmartTrade(`${index}`, {
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

    // @todo isCompleted() method
    const isFinished =
      smartTrade.sell && smartTrade.sell.status === OrderStatusEnum.Filled;

    if (isFinished) {
      // yield smartTrade.replace()
      const smartTradeRef = bot.smartTrades.find(
        (smartTradeRef) => smartTradeRef.smartTradeId === smartTrade.id,
      );
      console.log(
        `[useGridBot] SmartTrade finished Key: ${smartTradeRef.key} ID: ${smartTradeRef.smartTradeId}. Replacing it..`,
      );
      //
      // const newSmartTrade = yield replaceSmartTrade(
      //   smartTradeRef.key,
      //   smartTrade,
      // );
      // @todo replace() smartTrade

      console.log(
        `[useGridBot] SmartTrade with ID ${smartTrade.id} was replaced succesfully`,
      );
    }
  }
}
