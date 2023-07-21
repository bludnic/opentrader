/**
 * Idle - лимит ордер не размещен, его нету на бирже
 * placed - лимит ордер размещен, но не заполнен
 * filled - лимит ордер заполнен
 */
export enum OrderStatusEnum {
  Idle = 'idle',
  Placed = 'placed',
  Filled = 'filled',
}
