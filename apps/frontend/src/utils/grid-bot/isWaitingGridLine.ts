import type { TActiveSmartTrade } from "src/types/trpc";
import { getWaitingGridLinePrice } from "src/utils/grid-bot/getWaitingGridLinePrice";

/**
 * @param price - SmartTrade price
 * @param smartTrades - Array of SmartTrades
 */
export function isWaitingGridLine(
  price: number,
  smartTrades: TActiveSmartTrade[],
) {
  if (smartTrades.length === 0) {
    return false;
  }

  const waitingGridLinePrice = getWaitingGridLinePrice(smartTrades);

  return waitingGridLinePrice === price;
}
