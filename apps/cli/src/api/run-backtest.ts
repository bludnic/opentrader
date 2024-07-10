import { pro as ccxt } from "ccxt";
import { templates } from "@opentrader/bot-templates";
import { findStrategy } from "@opentrader/bot-templates/server";
import { Backtesting } from "@opentrader/backtesting";
import { CCXTCandlesProvider } from "@opentrader/bot";
import { logger } from "@opentrader/logger";
import { exchangeCodeMapCCXT } from "@opentrader/exchanges";
import type { BarSize, ExchangeCode, ICandlestick } from "@opentrader/types";
import type { CommandResult, ConfigName } from "../types.js";
import { readBotConfig } from "../config.js";

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

  let strategy: Awaited<ReturnType<typeof findStrategy>>;
  try {
    strategy = await findStrategy(strategyName);
  } catch (err) {
    logger.info((err as Error).message);

    return {
      result: undefined,
    };
  }

  // Validate strategy params
  const { success: isValidSchema, error } =
    strategy.strategyFn.schema.safeParse(botConfig.settings);
  if (!isValidSchema) {
    logger.error(error.message);
    logger.error(
      `The params for "${strategyName}" strategy are invalid. Check the "config.dev.json5"`,
    );

    return {
      result: undefined,
    };
  }

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
    botTemplate: strategy.strategyFn,
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
