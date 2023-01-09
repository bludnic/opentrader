import { SmartTradeParams } from '3commas-typescript/dist/types/types';
import { SmartTradeOrderSide } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/common/enums/smart-trade-order-side.enum';
import { SmartTradeOrderType } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/common/enums/smart-trade-order-type.enum';
import { SmartTradeProfitStepPriceType } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/types/smart-trade-take-profit/take-profit-step/profit-step-price/enums/smart-trade-profit-step-price-type.enum';
import { ITweetTradingBotSmartTradeSettings } from 'src/experiments/3commas-tweet-smart-trading/db/repositories/tweet-trading-bots/types/tweet-trading-bot/types/smart-trade-settings/tweet-trading-bot-smart-trade-settings.interface';
import { multiplyPriceByPercent } from './multiplyPriceByPercent';
import { baseQuoteThreeCommas } from './pairTo3commasPair';

export function fromSmartTradeSettingsToSmartTrade(
  smartTradeSettings: ITweetTradingBotSmartTradeSettings,
  currentAssetPrice: number,
): SmartTradeParams {
  const {
    accountId,
    baseCurrency,
    quoteCurrency,
    note,
    volume,
    takeProfitPercent,
    stopLossPercent,
  } = smartTradeSettings;

  const takeProfitPrice = multiplyPriceByPercent(
    currentAssetPrice,
    takeProfitPercent,
  );
  const stopLossPrice = multiplyPriceByPercent(
    currentAssetPrice,
    -stopLossPercent,
  );

  return {
    account_id: accountId,
    pair: baseQuoteThreeCommas(baseCurrency, quoteCurrency),
    note,
    position: {
      type: SmartTradeOrderSide.Buy,
      order_type: SmartTradeOrderType.Limit,
      price: {
        value: currentAssetPrice,
      },
      units: {
        value: volume,
      },
    },
    take_profit: {
      enabled: true,
      steps: [
        {
          volume: 100, // %
          order_type: SmartTradeOrderType.Limit,
          price: {
            value: takeProfitPrice,
            type: SmartTradeProfitStepPriceType.Last,
          },
        },
      ],
    },
    stop_loss: {
      enabled: true,
      order_type: SmartTradeOrderType.Limit,
      price: {
        value: stopLossPrice,
      },
      conditional: {
        price: {
          type: SmartTradeProfitStepPriceType.Last,
          value: stopLossPrice,
        },
      },
    },
  };
}
