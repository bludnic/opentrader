import { createBuyPlacedDeal } from 'src/core/db/firestore/utils/deals/createBuyPlacedDeal';
import { createSellPlacedDeal } from 'src/core/db/firestore/utils/deals/createSellPlacedDeal';
import {
  DealBuyPlaced,
  DealSellPlaced,
  IDeal,
} from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { generateDealId } from 'src/grid-bot/utils/deals/generateDealId';
import { isWaitingGridLevel } from 'src/grid-bot/utils/grid/isWaitingGridLevel';
import { generateOrderId } from 'src/grid-bot/utils/orders/generateOrderId';
import { calcSellPriceByGridLevel } from 'src/grid-bot/utils/orders/calcSellPriceByGridLevel';
import { calculateGridLevels } from 'src/grid-bot/utils/grid/calculateGridLevels';
import { calculateGridStepSize } from 'src/grid-bot/utils/grid/calculateGridStepSize';

/**
 * Calculate initial Deals based on current asset price when bot started.
 *
 * @param bot
 * @param currentAssetPrice
 */
export function calcInitialDealsByAssetPrice(
  bot: IGridBot,
  currentAssetPrice: number,
): IDeal[] {
  const gridLevels = calculateGridLevels(bot);

  const gridStepSize = calculateGridStepSize(
    bot.highPrice,
    bot.lowPrice,
    bot.gridLevels,
  );

  return gridLevels.flatMap<IDeal>((gridLevel, i) => {
    if (i === gridLevels.length - 1) {
      // skip last grid level because it has no TP
      return [];
    }

    const gridNumber = i + 1;

    const dealId = generateDealId(
      bot.baseCurrency,
      bot.quoteCurrency,
      gridNumber,
    );
    const buyOrderId = generateOrderId(
      bot.baseCurrency,
      bot.quoteCurrency,
      gridNumber,
      'buy',
    );
    const sellOrderId = generateOrderId(
      bot.baseCurrency,
      bot.quoteCurrency,
      gridNumber,
      'sell',
    );
    const sellOrderPrice = calcSellPriceByGridLevel(
      gridLevel.price,
      gridStepSize,
    );

    if (isWaitingGridLevel(gridLevel, gridStepSize, currentAssetPrice)) {
      const deal: DealSellPlaced = createSellPlacedDeal(
        dealId,
        buyOrderId,
        gridLevel.price, // цена покупки тут некорректна (см. коммент ниже)
        sellOrderId,
        sellOrderPrice,
      );

      return [deal];
    } else if (gridLevel.price > currentAssetPrice) {
      // Выставляя initial Sell ордера, мы не можем знать цену покупки.
      // Пользователь мог купить монеты ранее по неизвестной цене или
      // по рыночной цене в момент запуска бота. Нам эта цена неизвестна.
      // Получается "цена покупки" == gridLevel.price тут некорректна.
      //
      // Будущая фича:
      // Для статистики будет хорошо знать эту цену. Поэтому будет
      // неплохо дать возможность пользователю ввести в форму создания бота
      // цену по которой он купил коины.
      const deal: DealSellPlaced = createSellPlacedDeal(
        dealId,
        buyOrderId,
        gridLevel.price,
        sellOrderId,
        sellOrderPrice,
      );

      return [deal];
    } else {
      // gridLevel < currentAssetPrice

      const deal: DealBuyPlaced = createBuyPlacedDeal(
        dealId,
        buyOrderId,
        gridLevel.price,
        sellOrderId,
        sellOrderPrice,
      );

      return [deal];
    }

    return [];
  });
}
