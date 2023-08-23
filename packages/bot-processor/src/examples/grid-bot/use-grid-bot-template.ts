import { IExchange } from "@bifrost/exchanges";
import { OrderStatusEnum } from "@bifrost/types";
import { SmartTradeService } from "../../smart-trade.service";
import { IBotConfiguration, IBotControl } from "../../types";
import { useExchange, useSmartTrade } from "../../effects";

export function* useGridBot(
  control: IBotControl<IBotConfiguration>
): Generator<any, any, any> {
  const exchange: IExchange = yield useExchange();

  const symbol = `${control.bot.baseCurrency}/${control.bot.quoteCurrency}`;

  yield exchange.loadMarkets();
  const market = yield exchange.getSymbol({
    symbolId: symbol,
  });

  console.log("market", market);

  const marketPrice = yield exchange.getMarketPrice({
    symbol: symbol,
  });

  console.log("marketPrice", marketPrice);

  const smartTrade: SmartTradeService = yield useSmartTrade("st1", {
    quantity: 1,
    buy: {
      price: 10,
      status: OrderStatusEnum.Idle,
    },
    sell: {
      price: 20,
      status: OrderStatusEnum.Idle,
    },
  });

  console.log("useGridBot: smartTrade", smartTrade);
  console.log("useGridBot: marketPrice");
}
