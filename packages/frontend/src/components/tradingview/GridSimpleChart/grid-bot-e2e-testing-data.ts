type GridBotE2EBuyOrder = {
  side: "buy";
  price: number; // grid price;
};

type GridBotE2ESellOrder = {
  side: "sell";
  price: number; // grid price;
};

type GridBotE2EOrder = GridBotE2EBuyOrder | GridBotE2ESellOrder;

export type GridBotE2ETestingData = {
  time: string;
  price: number; // current market price
  orders: GridBotE2EOrder[];
};

function buy(price: number): GridBotE2EBuyOrder {
  return {
    side: "buy",
    price,
  };
}

function sell(price: number): GridBotE2ESellOrder {
  return {
    side: "sell",
    price,
  };
}

// @todo удалить файл, получить эти данные из REST ручки /grid-bot-debug/e2e/history-data
export const gridBotE2ETestingData: GridBotE2ETestingData[] = [
  { time: "2019-04-01", price: 15.2, orders: [] },
  { time: "2019-04-02", price: 14.9, orders: [] },
  { time: "2019-04-03", price: 15.6, orders: [] },
  { time: "2019-04-04", price: 15.2, orders: [] },
  { time: "2019-04-05", price: 15.3, orders: [] },
  { time: "2019-04-06", price: 13.5, orders: [buy(14)] },
  { time: "2019-04-07", price: 13.45, orders: [] },
  { time: "2019-04-08", price: 13.9, orders: [] },
  { time: "2019-04-09", price: 13.1, orders: [] },
  { time: "2019-04-10", price: 12.8, orders: [buy(13)] },
  { time: "2019-04-11", price: 13.45, orders: [] },
  { time: "2019-04-12", price: 15.6, orders: [sell(14), sell(15)] },
  { time: "2019-04-13", price: 16.5, orders: [sell(16)] },
  { time: "2019-04-14", price: 16.9, orders: [] },
  { time: "2019-04-15", price: 16.3, orders: [] },
  { time: "2019-04-16", price: 15.25, orders: [] },
  { time: "2019-04-17", price: 14.9, orders: [buy(15)] },
  { time: "2019-04-18", price: 13.3, orders: [buy(14)] },
  { time: "2019-04-19", price: 12.5, orders: [buy(13)] },
  { time: "2019-04-20", price: 10.2, orders: [buy(12), buy(11)] },
  { time: "2019-04-21", price: 10.1, orders: [] },
  { time: "2019-04-22", price: 9.5, orders: [buy(10)] },
  { time: "2019-04-23", price: 9.2, orders: [] },
  { time: "2019-04-24", price: 9.5, orders: [] },
  { time: "2019-04-25", price: 10.3, orders: [] },
  { time: "2019-04-26", price: 10.2, orders: [] },
  { time: "2019-04-27", price: 10.8, orders: [] },
  { time: "2019-04-28", price: 11.1, orders: [sell(11)] },
  { time: "2019-04-29", price: 12.5, orders: [sell(12)] },
  { time: "2019-04-30", price: 12.2, orders: [] },
  { time: "2019-05-01", price: 13.4, orders: [sell(13)] },
  { time: "2019-05-02", price: 11.1, orders: [buy(12)] },
  { time: "2019-05-03", price: 12.5, orders: [] },
  { time: "2019-05-04", price: 10.3, orders: [buy(11)] },
  { time: "2019-05-05", price: 12.1, orders: [sell(12)] },
  { time: "2019-05-06", price: 12.5, orders: [] },
  {
    time: "2019-05-07",
    price: 16.2,
    orders: [sell(13), sell(14), sell(15), sell(16)],
  },
  { time: "2019-05-08", price: 15.8, orders: [] },
  { time: "2019-05-09", price: 16.6, orders: [] },
  { time: "2019-05-10", price: 14.5, orders: [buy(15)] },
  { time: "2019-05-11", price: 15.2, orders: [] },
  { time: "2019-05-12", price: 15.3, orders: [] },
  { time: "2019-05-13", price: 15.9, orders: [] },
  { time: "2019-05-14", price: 16.1, orders: [sell(16)] },
  { time: "2019-05-15", price: 15.3, orders: [] },
  { time: "2019-05-16", price: 16.5, orders: [] },
  { time: "2019-05-17", price: 16.2, orders: [] },
  { time: "2019-05-18", price: 17.6, orders: [sell(17)] },
  { time: "2019-05-19", price: 18.3, orders: [sell(18)] },
  { time: "2019-05-20", price: 18.6, orders: [] },
  { time: "2019-05-21", price: 17.3, orders: [] },
  { time: "2019-05-22", price: 16.8, orders: [buy(17)] },
  { time: "2019-05-23", price: 17.2, orders: [] },
  { time: "2019-05-24", price: 18.25, orders: [sell(18)] },
  { time: "2019-05-25", price: 20.5, orders: [sell(19), sell(20)] },
];
