export const FETCH_CANDLESTICKS_HISTORY_CRON_JOB_NAME =
  'fetchCandlesticksHistory';

/**
 * If job failed, e.g. the exchange rate limit exceeded,
 *  the following timeout will be used before restarting the job.
 */
export const FETCH_CANDLESTICKS_HISTORY_CRON_JOB_FAIL_TIMEOUT = 60; // seconds
