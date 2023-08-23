import { IExchange } from "@bifrost/exchanges";
import {
  IBotControl,
  useExchange,
  useSmartTrade,
  SmartTradeService,
} from "@bifrost/bot-processor";
import { ICandlestick, IGetMarketPriceResponse } from "@bifrost/types";
// import candlesticks from "../../exchanges/src/test/data/UNI_USDT_2023-08-01_2023-08-15.json";
// import candlesticks from "../../exchanges/src/test/data/UNI_USDT_2023-01-2023-08.json";
import {
  calcGridLines,
  computeGridFromCurrentAssetPrice,
} from "@bifrost/tools";
import { Backtesting } from "./index";

const botConfig = {
  id: "UNI_USDT_BOT",
  baseCurrency: "ADA",
  quoteCurrency: "USDT",
  comment: "Hello world",
  gridLines: calcGridLines(6.7, 5.7, 11, 1),
};

console.log(botConfig);

export function* useGridBot(control: IBotControl<typeof botConfig>) {
  const { bot } = control;

  const exchange: IExchange = yield useExchange();
  const { price }: IGetMarketPriceResponse = yield exchange.getMarketPrice({
    symbol: `${bot.baseCurrency}/${bot.quoteCurrency}`,
  });

  const gridLevels = computeGridFromCurrentAssetPrice(bot.gridLines, price);

  console.log("useGridBot: currentAssetPrice", price);

  for (const [index, grid] of gridLevels.entries()) {
    const smartTrade: SmartTradeService = yield useSmartTrade(`${index}`, {
      buy: {
        price: grid.buy.price,
        status: grid.buy.status,
      },
      sell: {
        price: grid.sell.price,
        status: grid.sell.status,
      },
      quantity: grid.buy.quantity, // or grid.sell.quantity
    });

    if (smartTrade.isCompleted()) {
      console.log(`[useGridBot] ST #${index} finished: Replacing it...`);
      const newSmartTrade: SmartTradeService = yield smartTrade.replace();

      console.log(
        `[useGridBot] SmartTrade with ID ${newSmartTrade.id} was replaced successfully`
      );
    }
  }
}

// async function run() {
//   console.log("run");
//   const backtesting = new Backtesting(botConfig);
//
//   const report = await backtesting.run(
//     useGridBot,
//     candlesticks as ICandlestick[]
//   );
//   console.log(report);
// }

// run();
