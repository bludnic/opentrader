import { pro as ccxt } from "ccxt";
import { gridBot, type GridBotConfig } from "@opentrader/bot-templates";
import { Backtesting } from "@opentrader/backtesting";

export async function runBacktest() {
  const exchange = new ccxt.bybit();
  const config: GridBotConfig = {
    id: 1,
    settings: {
      gridLines: [
        { price: 1600, quantity: 1 },
        { price: 1655, quantity: 1 },
        { price: 1711, quantity: 1 },
        { price: 1766, quantity: 1 },
        { price: 1822, quantity: 1 },
        { price: 1877, quantity: 1 },
        { price: 1933, quantity: 1 },
        { price: 1988, quantity: 1 },
        { price: 2044, quantity: 1 },
        { price: 2100, quantity: 1 },
      ],
    },
    baseCurrency: "ETH",
    quoteCurrency: "USDT",
    exchangeCode: "OKX",
  };
  console.log("Bot config", config);

  const backtesting = new Backtesting({
    botConfig: config,
    botTemplate: gridBot,
  });

  const candlesticks = await exchange.fetchOHLCV("BTC/USDT", "5m");
  const candlesticksNormalized = candlesticks.map((candlestick) => ({
    open: candlestick[1],
    high: candlestick[2],
    low: candlestick[3],
    close: candlestick[4],
    timestamp: candlestick[0],
  }));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- no types
  console.log(`Fetched ${candlesticks.length} candlesticks`);
  const report = await backtesting.run(candlesticksNormalized);

  console.log(report);
}
