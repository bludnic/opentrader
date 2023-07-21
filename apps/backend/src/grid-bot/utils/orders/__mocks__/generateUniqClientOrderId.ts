import { OrderSide } from '@bifrost/types';

// DO NOT IMPORT!
// This is a mock function for tests.
function generateUniqClientOrderIdMockFn(
  baseCurrency: string,
  quoteCurrency: string,
  gridNumber: number,
  side: OrderSide,
) {
  const sideSymbol = side === 'buy' ? 'B' : 'S';

  return `${baseCurrency}${quoteCurrency}${gridNumber}${sideSymbol}`;
}

module.exports = {
  generateUniqClientOrderId: generateUniqClientOrderIdMockFn,
};
