export interface ITwitterSignal {
  id: string;
  name: string;
  description: string;

  /**
   * The `query` parameter that is passed to the Twitter API.
   *
   * e.g.: DOGE (from:elonmusk)
   *
   * Will query recent Elon Musk tweets that contain word DOGE.
   */
  twitterQuery: string;

  /**
   * Should cron watch for this signal?
   */
  enabled: boolean;

  createdAt: number; // timestamp
}
