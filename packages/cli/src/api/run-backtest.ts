import { pro as ccxt } from "ccxt";
import { templates } from "@opentrader/bot-templates";
import { Backtesting } from "@opentrader/backtesting";
import { CCXTCandlesProvider } from "@opentrader/bot";
import { logger } from "@opentrader/logger";
import { exchangeCodeMapCCXT } from "@opentrader/exchanges";
import type { BarSize, ExchangeCode, ICandlestick } from "@opentrader/types";
import type { CommandResult, ConfigName } from "../types";
import { readBotConfig } from "../config";
import { existsSync } from "fs";
import { join } from "path";

type Options = {
  config: ConfigName;
  from: Date;
  to: Date;
  timeframe: BarSize;
  pair: string;
  exchange: ExchangeCode;
};

export async function runBacktest(
  strategyName: keyof typeof templates,
  options: Options,
): Promise<CommandResult> {
  const botConfig = readBotConfig(options.config);
  logger.debug(botConfig, "Parsed bot config");

  let strategyFn;
  const isCustomStrategyFile = existsSync(join(process.cwd(), strategyName));
  const strategyExists = strategyName in templates;

  if (isCustomStrategyFile) {
    const { default: fn } = await import(join(process.cwd(), strategyName));
    strategyFn = fn;
  } else if (strategyExists) {
    strategyFn = templates[strategyName];
  } else {
    const availableStrategies = Object.keys(templates).join(", ");
    logger.info(
      `Strategy "${strategyName}" does not exists. Available strategies: ${availableStrategies}`,
    );

    return {
      result: undefined,
    };
  }

  const botTemplate = strategyName || botConfig.template;
  const botTimeframe = options.timeframe || botConfig.timeframe || null;
  const botPair = options.pair || botConfig.pair;
  const [baseCurrency, quoteCurrency] = botPair.split("/");

  const ccxtExchange = exchangeCodeMapCCXT[options.exchange];
  const exchange = new ccxt[ccxtExchange]();

  logger.info(
    `Using ${botPair} on ${options.exchange} exchange with ${botTimeframe} timeframe`,
  );
  const backtesting = new Backtesting({
    botConfig: {
      id: 0,
      baseCurrency,
      quoteCurrency,
      exchangeCode: options.exchange,
      settings: botConfig.settings,
    },
    botTemplate: strategyFn,
  });

  return new Promise((resolve) => {
    const candles: ICandlestick[] = [];

    const candleProvider = new CCXTCandlesProvider({
      exchange,
      symbol: botPair,
      timeframe: botTimeframe,
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
