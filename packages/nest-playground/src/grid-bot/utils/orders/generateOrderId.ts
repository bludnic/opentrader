import { OrderSide } from 'src/core/exchanges/okx/types/exchange/trade/common/types/order-side.type';

export function generateOrderId(
  baseCurrency: string,
  quoteCurrency: string,
  gridNumber: number,
  side: OrderSide,
) {
  const sideSymbol = side === 'buy' ? 'B' : 'S';

  return `${baseCurrency}${quoteCurrency}${gridNumber}${sideSymbol}`;
}
