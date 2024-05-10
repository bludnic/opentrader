import { pro as ccxt } from "ccxt";
import { templates } from "@opentrader/bot-templates";
import { Backtesting } from "@opentrader/backtesting";
import { CCXTCandlesProvider } from "@opentrader/bot";
import { logger } from "@opentrader/logger";
import type { BarSize, ICandlestick } from "@opentrader/types";
import type { CommandResult, ConfigName } from "../types";
import { readBotConfig } from "../config";
import { exchangeClassMap } from "../utils/ccxt";

export async function runBacktest(
  strategyName: keyof typeof templates,
  options: {
    config: ConfigName;
    from: Date;
    to: Date;
    timeframe: BarSize;
    symbol: string;
  },
): Promise<CommandResult> {
  const config = readBotConfig(options.config);
  logger.debug(config, "Parsed bot config");

  const strategyExists = strategyName in templates;
  if (!strategyExists) {
    const availableStrategies = Object.keys(templates).join(", ");
    logger.info(
      `Strategy "${strategyName}" does not exists. Available strategies: ${availableStrategies}`,
    );

    return {
      result: undefined,
    };
  }

  const ccxtExchange = exchangeClassMap[config.exchangeCode];
  const exchange = new ccxt[ccxtExchange]();

  const backtesting = new Backtesting({
    botConfig: config,
    botTemplate: templates[strategyName],
  });

  return new Promise((resolve) => {
    const candles: ICandlestick[] = [];

    const candleProvider = new CCXTCandlesProvider({
      exchange,
      symbol: options.symbol,
      timeframe: options.timeframe,
      startDate: options.from,
      endDate: options.to,
    });

    candleProvider.on("candle", (candle) => candles.push(candle));

    candleProvider.on("done", async () => {
      logger.info(`Fetched ${candles.length} candlesticks`);
      const report = await backtesting.run(candles);

      resolve({
        result: report,
      });
    });

    candleProvider.emit("start");
  });
}
