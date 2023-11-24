import type { IGridLine } from "@opentrader/types";
import { arithmeticGridBot } from "@opentrader/bot-templates";
import { Backtesting } from "@opentrader/backtesting";
import type { IBotConfiguration } from "@opentrader/bot-processor";
// import { calcGridLines } from "@opentrader/tools";
import axios from "axios";

type BotConfig = {
  gridLines: IGridLine[];
} & IBotConfiguration;

async function run() {
  const config: BotConfig = {
    id: 1,
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
    baseCurrency: "ETH",
    quoteCurrency: "USDT",
  };
  console.log("Bot config", config);

  const backtesting = new Backtesting({
    botConfig: config,
    botTemplate: arithmeticGridBot,
  });

  const {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- no types
    data: { candlesticks },
  } = await axios.get("http://localhost:5000/mapi/candlesticks", {
    params: {
      symbolId: "OKX:ETH/USDT",
      startDate: "2023-07-01",
      endDate: "2023-07-31",
      timeframe: "1m",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- no types
  console.log(`Fetched ${candlesticks.length} candlesticks`);
  const report = await backtesting.run(candlesticks);

  console.log(report);
}

void run();
