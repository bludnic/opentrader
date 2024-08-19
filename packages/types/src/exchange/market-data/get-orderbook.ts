export type IBid = {
  price: number;
  quantity: number;
};

export type IAsk = {
  price: number;
  quantity: number;
};

export type IOrderbook = {
  asks: IAsk[];
  bids: IBid[];
  /**
   * Timestamp of the orderbook in milliseconds
   */
  timestamp: number;
  /**
   * Marget symbol as BTC/USDT
   */
  symbol: string;
};
