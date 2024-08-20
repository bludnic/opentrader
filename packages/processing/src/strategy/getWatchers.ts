import { TBotWithExchangeAccount } from "@opentrader/db";
import { isValidSymbol } from "@opentrader/tools";
import { BotTemplate, IBotConfiguration, WatchCondition, Watcher } from "@opentrader/bot-processor";
import { BarSize, ExchangeCode } from "@opentrader/types";

/**
 * Extracts symbols from the watch condition.
 */
const extractSymbols = (
  watchCondition: WatchCondition<IBotConfiguration> | undefined,
  bot: TBotWithExchangeAccount,
): string[] => {
  let symbols: string | string[] | undefined;

  if (typeof watchCondition === "function") {
    symbols = watchCondition({
      id: bot.id,
      symbol: bot.symbol,
      settings: bot.settings,
      timeframe: bot.timeframe as BarSize | null,
      exchangeCode: bot.exchangeAccount.exchangeCode as ExchangeCode,
    });
  } else {
    symbols = watchCondition;
  }

  symbols = Array.isArray(symbols) ? symbols : typeof symbols === "string" ? [symbols] : [];

  return symbols.map((symbol) => {
    const isSymbol = isValidSymbol(symbol);

    // If the symbol doesn't contain exchange code, add the default exchange code from the bot config
    // Example: BTC/USDT -> OKX:BTC/USDT
    return isSymbol ? `${bot.exchangeAccount.exchangeCode}:${symbol}` : symbol;
  });
};

/**
 * Retrieve watchers configurations from the strategy.
 * If the watcher is a function, it will be invoked and the result will be returned.
 */
export function getWatchers(strategyFn: BotTemplate<any>, bot: TBotWithExchangeAccount): Record<Watcher, string[]> {
  if (!strategyFn.watchers) {
    console.warn(`Strategy ${strategyFn.name} does not contain any watcher`);

    return {
      [Watcher.watchTrades]: [],
      [Watcher.watchOrderbook]: [],
      [Watcher.watchTicker]: [],
      [Watcher.watchCandles]: [],
    };
  }

  return {
    [Watcher.watchTrades]: extractSymbols(strategyFn.watchers[Watcher.watchTrades], bot),
    [Watcher.watchOrderbook]: extractSymbols(strategyFn.watchers[Watcher.watchOrderbook], bot),
    [Watcher.watchTicker]: extractSymbols(strategyFn.watchers[Watcher.watchTicker], bot),
    [Watcher.watchCandles]: extractSymbols(strategyFn.watchers[Watcher.watchCandles], bot),
  };
}
