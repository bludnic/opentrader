/**
 * @see https://www.okex.com/docs-v5/en/#rest-api-trade-place-order
 */
/**
 * Trade mode.
 *
 * Margin mode: `cross`, `isolated`
 * Non-Margin mode: `cash`
 */
export type OKXTradeMode = 'cross' | 'isolated' | 'cash';

/**
 * Order side.
 */
export type OKXOrderSide = 'buy' | 'sell';

/**
 * Position side.
 *
 * The default is `net` in the `net` mode
 * It is required in the `long/short` mode, and can only be `long` or `short`.
 * Only applicable to `FUTURES/SWAP`.
 */
export type OKXPositionSide = 'net' | 'long' | 'short';

/**
 * Order type
 *
 * `market`: Market order
 * `limit`: Limit order
 * `post_only`: Post-only order
 * `fok`: Fill-or-kill order
 * `ioc`: Immediate-or-cancel order
 * `optimal_limit_ioc` :Market order with immediate-or-cancel order (applicable only to Futures and Perpetual swap).
 */
export type OKXOrderType =
  | 'market'
  | 'limit'
  | 'post_only'
  | 'fok'
  | 'ioc'
  | 'optimal_limit_ioc';

/**
 * Quantity type.
 *
 * `base_ccy`: Base currency
 * `quote_ccy`: Quote currency
 *
 * Only applicable to `SPOT` traded with Market order
 */
export type OKXQuantityType = 'base_ccy' | 'quote_ccy';

/**
 * Order status.
 */
export type OKXOrderState = 'canceled' | 'live' | 'partially_filled' | 'filled';
