export interface ISmartTradeExecutor {
  /**
   * Execute the next step in the smart trade, e.g. place an order.
   * Return `true` if the step was executed, `false` otherwise.
   */
  next: () => Promise<boolean>;

  /**
   * Cancel all orders linked to the smart trade.
   * Return number of cancelled orders.
   */
  cancelOrders: () => Promise<number>;

  get status(): "Entering" | "Exiting" | "Finished"
}
