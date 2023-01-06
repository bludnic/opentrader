import { createBuyPlacedDeal } from 'src/core/db/firestore/utils/deals/createBuyPlacedDeal';
import { createSellPlacedDeal } from 'src/core/db/firestore/utils/deals/createSellPlacedDeal';
import {
  DealBuyPlaced,
  DealSellPlaced,
  IDeal,
} from 'src/core/db/types/entities/grid-bots/deals/types';
import { IGridLine } from 'src/core/db/types/entities/grid-bots/grid-lines/grid-line.interface';
import { generateDealId } from 'src/grid-bot/utils/deals/generateDealId';
import { nextGridLinePrice } from 'src/grid-bot/utils/deals/nextGridLinePrice';
import { isWaitingGridLine } from 'src/grid-bot/utils/grid/isWaitingGridLine';
import { generateUniqClientOrderId } from 'src/grid-bot/utils/orders/generateUniqClientOrderId';

export function calcInitialDealsByGridLines(
  gridLines: IGridLine[],
  baseCurrency: string,
  quoteCurrency: string,
  currentAssetPrice: number,
): IDeal[] {
  return gridLines.flatMap<IDeal>((gridLine, i) => {
    if (i === gridLines.length - 1) {
      // skip last grid level because it has no TP
      return [];
    }

    const gridNumber = i + 1;

    const dealId = generateDealId(baseCurrency, quoteCurrency, gridNumber);
    const buyOrderId = generateUniqClientOrderId(
      baseCurrency,
      quoteCurrency,
      gridNumber,
      'buy',
    );
    const sellOrderId = generateUniqClientOrderId(
      baseCurrency,
      quoteCurrency,
      gridNumber,
      'sell',
    );
    const sellOrderPrice = nextGridLinePrice(gridLines, i);

    if (isWaitingGridLine(gridLine, gridLines, currentAssetPrice)) {
      const deal: DealSellPlaced = createSellPlacedDeal(
        dealId,
        buyOrderId,
        gridLine.price,
        sellOrderId,
        sellOrderPrice,
        gridLine.quantity,
      );

      return [deal];
    } else if (gridLine.price > currentAssetPrice) {
      const deal: DealSellPlaced = createSellPlacedDeal(
        dealId,
        buyOrderId,
        gridLine.price,
        sellOrderId,
        sellOrderPrice,
        gridLine.quantity,
      );

      return [deal];
    } else {
      // gridLevel < currentAssetPrice

      const deal: DealBuyPlaced = createBuyPlacedDeal(
        dealId,
        buyOrderId,
        gridLine.price,
        sellOrderId,
        sellOrderPrice,
        gridLine.quantity,
      );

      return [deal];
    }

    return [];
  });
}
