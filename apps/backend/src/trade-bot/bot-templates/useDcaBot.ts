type ISmartTrade = any;
let useDCADeal: any;
let useQFLSignal: any;

const numberOfActiveDeals = 3;

export function* useDCABot() {
  for (let i = 0; i < numberOfActiveDeals; i++) {
    const isActive = useQFLSignal();

    const deal = yield useDCADeal(`${i}`, {
      buyPrice: 10,
      sellPrice: 20,
      safetyOrders: 3,
    });

    console.log('Deal #' + i, deal);

    if (deal.status === 'finished') {
      yield deal.replace();
    }
  }
}
