import { IGridLine, isWaitingGridLine, nextGridLinePrice } from "@bifrost/tools";
import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum";
import { IGridBotLevel } from "src/grid-bot/types/grid-bot-level.interface";

/**
 * Computes initial grid levels based on current asset price.
 * 
 * @param gridLines 
 * @param currentAssetPrice 
 * @returns 
 */
export function computeGridFromCurrentAssetPrice(
  gridLines: IGridLine[],
  currentAssetPrice: number,
): IGridBotLevel[] {
    return gridLines.flatMap<IGridBotLevel>((gridLine, i) => {
      if (i === gridLines.length - 1) {
        // skip last grid level because it has no TP
        return [];
      }
 
      const sellOrderPrice = nextGridLinePrice(gridLines, i);
      console.log('gridLinePrice buy:sell', gridLine.price, sellOrderPrice)

      if (
        isWaitingGridLine(gridLine, gridLines, currentAssetPrice) ||
        gridLine.price > currentAssetPrice
      ) {
        const gridLevel: IGridBotLevel = {
            buy: {
              price: gridLine.price,
              quantity: gridLine.quantity,
              status: OrderStatusEnum.Filled
            },
            sell: {
              price: sellOrderPrice,
              quantity: gridLine.quantity,
              status: OrderStatusEnum.Idle
            }
        }
  
        return [gridLevel];
      } else {
        // gridLevel < currentAssetPrice
  
        const gridLevel: IGridBotLevel = {
            buy: {
                price: gridLine.price,
                quantity: gridLine.quantity,
                status: OrderStatusEnum.Idle
            },
            sell: {
                price: sellOrderPrice,
                quantity: gridLine.quantity,
                status: OrderStatusEnum.Idle
            }
        }
  
        return [gridLevel];
      }
    });
  }
  