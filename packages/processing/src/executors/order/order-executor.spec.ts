import { ExchangeAccountWithCredentials, SmartTradeWithOrders, xprisma } from "@opentrader/db";
import { exchangeProvider, IExchange } from "@opentrader/exchanges";
import { Order } from "@opentrader/db";
import { OrderExecutor } from "./order.executor.js";
import { createTrade, getExchangeAccount } from "../../utils/test.js";

describe("OrderExecutor", () => {
  let exchangeAccount: ExchangeAccountWithCredentials;

  let smartTrade: SmartTradeWithOrders;
  let order: Order;
  let orderExecutor: OrderExecutor;
  let symbol: string;

  let exchange: IExchange;

  beforeAll(async () => {
    exchangeAccount = await getExchangeAccount();
    exchange = exchangeProvider.fromAccount(exchangeAccount);
  });

  beforeEach(async () => {
    smartTrade = await createTrade({
      symbol: "BTC/USDT",
      entry: {
        type: "Limit",
        side: "Buy",
        price: 10000,
        quantity: 0.0001,
      },
    });
    order = smartTrade.orders.find((o) => o.entityType === "EntryOrder")!;
    symbol = smartTrade.symbol;
  });

  afterEach(async () => {
    if (orderExecutor) {
      await orderExecutor.cancel();
    }

    if (smartTrade) {
      await xprisma.smartTrade.delete({
        where: {
          id: smartTrade.id,
        },
      });
    }
  });

  it("should cancel the order with status Idle", async () => {
    orderExecutor = new OrderExecutor(order, exchange, symbol);

    expect(orderExecutor.status).toBe("Idle");

    const cancelled = await orderExecutor.cancel();

    expect(orderExecutor.status).toBe("Revoked");
    expect(cancelled).toBe(true);
  });

  it("should cancel the order with status Placed", async () => {
    orderExecutor = new OrderExecutor(order, exchange, symbol);
    await orderExecutor.place();

    expect(orderExecutor.status).toBe("Placed");

    const cancelled = await orderExecutor.cancel();

    expect(orderExecutor.status).toBe("Canceled");
    expect(cancelled).toBe(true);
  });

  it("should skip execution if the order is already canceled", async () => {
    orderExecutor = new OrderExecutor(order, exchange, symbol);

    await orderExecutor.place();
    await orderExecutor.cancel();

    const cancelled = await orderExecutor.cancel();
    expect(cancelled).toBe(false);
  });

  it("should place the order", async () => {
    orderExecutor = new OrderExecutor(order, exchange, symbol);

    const placed = await orderExecutor.place();
    expect(placed).toBe(true);
    expect(orderExecutor.status).toBe("Placed");
  });

  it("should skip placing the order if the order is already placed", async () => {
    orderExecutor = new OrderExecutor(order, exchange, symbol);

    await orderExecutor.place();

    const placed = await orderExecutor.place();
    expect(placed).toBe(false);
  });

  it("should skip placing the order if the order is already canceled", async () => {
    orderExecutor = new OrderExecutor(order, exchange, symbol);

    await orderExecutor.place();
    await orderExecutor.cancel();

    const placed = await orderExecutor.place();
    expect(placed).toBe(false);
  });
});
