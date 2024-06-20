import {
  ExchangeAccountWithCredentials,
  SmartTradeWithOrders,
  xprisma,
} from "@opentrader/db";
import { exchangeProvider, IExchange } from "@opentrader/exchanges";
import { TradeExecutor } from "./trade.executor.js";
import {
  createTrade,
  getExchangeAccount,
  updateEntryOrder,
} from "../../utils/test.js";

describe("TradeExecutor", () => {
  let exchangeAccount: ExchangeAccountWithCredentials;

  let smartTrade: SmartTradeWithOrders;
  let tradeExecutor: TradeExecutor;

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
      takeProfit: {
        type: "Limit",
        side: "Sell",
        price: 1000000,
        quantity: 0.0001,
      },
    });
  });

  afterEach(async () => {
    if (tradeExecutor) {
      await tradeExecutor.cancelOrders();
    }

    if (smartTrade) {
      await xprisma.smartTrade.delete({
        where: {
          id: smartTrade.id,
        },
      });
    }
  });

  it("should cancel the position with status Idle", async () => {
    tradeExecutor = new TradeExecutor(smartTrade, exchange);

    expect(tradeExecutor.status).toBe("Entering");

    const cancelledCount = await tradeExecutor.cancelOrders();

    expect(tradeExecutor.status).toBe("Finished");
    expect(cancelledCount).toBe(2);
  });

  it("should cancel the position when entry order is Placed", async () => {
    tradeExecutor = new TradeExecutor(smartTrade, exchange);

    await tradeExecutor.next();
    expect(tradeExecutor.status).toBe("Entering");

    const cancelled = await tradeExecutor.cancelOrders();
    expect(tradeExecutor.status).toBe("Finished");
    expect(cancelled).toBe(2);
  });

  it("should cancel the position when entry order is Filled", async () => {
    tradeExecutor = new TradeExecutor(smartTrade, exchange);

    await tradeExecutor.next();
    expect(tradeExecutor.status).toBe("Entering");

    await updateEntryOrder(
      {
        status: "Filled",
        filledPrice: 10000,
        filledAt: new Date(),
      },
      smartTrade,
    );
    await tradeExecutor.pull();
    expect(tradeExecutor.status).toBe("Existing");

    const cancelled = await tradeExecutor.cancelOrders();
    expect(tradeExecutor.status).toBe("Finished");
    expect(cancelled).toBe(1);
  });
});
