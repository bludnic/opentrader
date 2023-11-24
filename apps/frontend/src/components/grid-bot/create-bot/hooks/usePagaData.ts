import type { ExchangeCode } from "@opentrader/types";
import { tClient } from "src/lib/trpc/client";

export function usePageData() {
  const [exchangeAccounts] = tClient.exchangeAccount.list.useSuspenseQuery();
  const exchangeAccount = exchangeAccounts[0];

  const [symbols] = tClient.symbol.list.useSuspenseQuery(
    exchangeAccount.exchangeCode as ExchangeCode,
  );

  // assume that every exchange has a BTC/USDT pair
  // if not, then get the first one
  const symbol =
    symbols.find((symbol) => symbol.currencyPair === "BTC/USDT") || symbols[0];

  const [{ price: currentAssetPrice }] = tClient.symbol.price.useSuspenseQuery({
    symbolId: symbol.symbolId,
  });

  const [{ lowPrice, highPrice }] =
    tClient.gridBot.formOptions.useSuspenseQuery({
      symbolId: symbol.symbolId,
    });

  return {
    exchangeAccount,
    symbol,
    currentAssetPrice,
    lowPrice,
    highPrice,
  };
}
