import { OrderSide } from 'src/core/exchanges/types/exchange/trade/common/types/order-side.type';
import { generateUniqId } from 'src/grid-bot/utils/generateUniqId';

// We need these arguments to generate predictable IDs in the unit and e2e tests
// See the mock implementation in ./__mocks__/generateUniqClientOrderId
export function generateUniqClientOrderId(
  baseCurrency: string,
  quoteCurrency: string,
  gridNumber: number,
  side: OrderSide,
) {
  // const sideSymbol = side === 'buy' ? 'B' : 'S';
  //
  // return `${baseCurrency}${quoteCurrency}${gridNumber}${sideSymbol}`;

  return generateUniqId();
}
