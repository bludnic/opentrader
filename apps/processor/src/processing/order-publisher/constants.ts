/**
 * How often to run the OrderPublisher job (in seconds)
 */
export const ORDER_PUBLISHER_INTERVAL = 5000;

/**
 * Restart job timeout when there are no orders to be placed.
 */
export const ORDER_PUBLISHER_TIMEOUT_IF_NO_ORDERS = 60000;
