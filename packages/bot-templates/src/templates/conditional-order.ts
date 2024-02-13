import type { IExchange } from "#exchanges/types";
import type { TBotContext } from "@opentrader/bot-processor";
import { useExchange } from "@opentrader/bot-processor";

export function* conditionalOrder(ctx: TBotContext<any>) {
  console.log("Conditional order exec");
  const exchange: IExchange = yield useExchange();

  // const result = yield exchange.createOrder();
  // console.log("Created order", result);

  const result2 = yield exchange.getLimitOrder({
    orderId: '674179352040411136',
    symbol: 'ETH/USDT'
  })
  console.log('Order details', result2)

  // const result = yield exchange.placeOCOOrder({
  //   tpType: "limit",
  //   slType: "limit",
  //   symbol: "ETH/USDT",
  //   side: "sell",
  //   quantity: 0.01,
  //   tpStopPrice: 2500,
  //   tpPrice: 2400,
  //   slStopPrice: 2000,
  //   slPrice: 2100,
  // });
  // console.log("OCO sell order", result);
  //
  // const result2 = yield exchange.placeOCOOrder({
  //   tpType: "limit",
  //   slType: "limit",
  //   symbol: "ETH/USDT",
  //   side: "buy",
  //   quantity: 0.01,
  //   tpStopPrice: 2000,
  //   tpPrice: 2100,
  //   slStopPrice: 2500,
  //   slPrice: 2400,
  // });
  // console.log("OCO buy order", result2);

  // const result = yield exchange.placeOCOOrder({
  //   tpType: "market",
  //   slType: "limit",
  //   symbol: "ETH/USDT",
  //   side: "sell",
  //   quantity: 0.01,
  //   tpStopPrice: 2500,
  //   // tpPrice: 2400,
  //   slStopPrice: 2000,
  //   slPrice: 2100,
  // });
  // console.log("OCO sell limit market", result);

  // const order = yield exchange.getLimitOrder({
  //   orderId: result.orderId,
  //   symbol: "ETH/USDT",
  // });
  // console.log('Get Limit Order', order)

  // const order2 = yield exchange.getAlgoOrder({
  //   orderId: '674163907237351424',
  //   symbol: "ETH/USDT",
  // });
  // console.log('Get Algo Order', order2)

  // const result = yield exchange.placeStopLimitOrder({
  //   symbol: "ETH/USDT",
  //   side: "buy",
  //   quantity: 0.01,
  //   stopPrice: 2000,
  //   price: 2100,
  // });
  // console.log("Stop limit placed", result);
  //
  // const result2 = yield exchange.placeStopOrder({
  //   type: 'market',
  //   symbol: "ETH/USDT",
  //   side: "buy",
  //   quantity: 0.01,
  //   stopPrice: 1900,
  //   price: undefined
  // });
  // console.log("Stop market placed", result2);
  //
  //
  // const result3 = yield exchange.placeStopLimitOrder({
  //   symbol: "ETH/USDT",
  //   side: "sell",
  //   quantity: 0.02,
  //   stopPrice: 3000,
  //   price: 2900,
  // });
  // console.log("Stop limit sell order", result3);
  //
  //
  // const result4 = yield exchange.placeStopMarketOrder({
  //   symbol: "ETH/USDT",
  //   side: "sell",
  //   quantity: 0.02,
  //   stopPrice: 3100,
  // });
  // console.log("Stop limit sell order", result4);
}
