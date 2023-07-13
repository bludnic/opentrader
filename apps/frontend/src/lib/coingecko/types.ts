/** Недостаующие типы из свагера **/
export type CGMarketChartPrice<Timestamp = number, Price = number> = [
  Timestamp,
  Price
];

export type CGOHLCChartPrice<
  Timestamp = number,
  Open = number,
  High = number,
  Low = number,
  Close = number
> = [Timestamp, Open, High, Low, Close];
