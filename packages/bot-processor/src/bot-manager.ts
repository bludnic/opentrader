import type { IExchange } from "@opentrader/exchanges";
import { computeIndicators } from "@opentrader/indicators";
import type { IndicatorBarSize } from "@opentrader/types";
import { lastClosedCandleDate } from "@opentrader/tools";
import type { TBotContext } from "./types/bot/bot-context.type";
import { createContext } from "./utils/createContext";
import { SmartTradeService } from "./smart-trade.service";
import type { IBotConfiguration, BotTemplate, IBotControl } from "./types";
import { isReplaceSmartTradeEffect } from "./effects/utils/isReplaceSmartTradeEffect";
import { isUseExchangeEffect } from "./effects/utils/isUseExchangeEffect";
import { isUseSmartTradeEffect } from "./effects/utils/isUseSmartTradeEffect";
import { isCancelSmartTradeEffect } from "./effects/utils/isCancelSmartTradeEffect";
import { isUseIndicatorsEffect } from "./effects/utils/isUseIndicatorsEffect";
import { isGetSmartTradeEffect } from "./effects/utils/isGetSmartTradeEffect";
import { isCreateSmartTradeEffect } from "./effects/utils/isCreateSmartTradeEffect";

export class BotManager<T extends IBotConfiguration> {
  constructor(
    private control: IBotControl,
    private botConfig: T,
    private exchange: IExchange,
    private botTemplate: BotTemplate<T>,
  ) {}

  async start() {
    const context = createContext(this.control, this.botConfig, "start");

    await this._process(context);
  }

  async stop() {
    const context = createContext(this.control, this.botConfig, "stop");

    await this._process(context);
  }

  async process() {
    const context = createContext(this.control, this.botConfig, "process");

    await this._process(context);
  }

  private async _process(context: TBotContext<T>): Promise<void> {
    const processingDate = Date.now(); // @todo better to pass it through context
    const generator = this.botTemplate(context);

    let item = generator.next();

    for (; !item.done; ) {
      if (item.value instanceof Promise) {
        const result = await item.value;

        item = generator.next(result);
      } else if (isUseSmartTradeEffect(item.value)) {
        const effect = item.value;

        const smartTrade = await this.control.getOrCreateSmartTrade(
          effect.ref,
          effect.payload,
        );
        const smartTradeService = new SmartTradeService(effect.ref, smartTrade);

        item = generator.next(smartTradeService);
      } else if (isReplaceSmartTradeEffect(item.value)) {
        const effect = item.value;

        const smartTrade = await this.control.replaceSmartTrade(
          effect.ref,
          effect.payload,
        );
        const smartTradeService = new SmartTradeService(effect.ref, smartTrade);

        item = generator.next(smartTradeService);
      } else if (isCancelSmartTradeEffect(item.value)) {
        const effect = item.value;

        await this.control.cancelSmartTrade(effect.ref);

        item = generator.next();
      } else if (isGetSmartTradeEffect(item.value)) {
        const effect = item.value;

        const smartTrade = await this.control.getSmartTrade(effect.ref);
        const smartTradeService = smartTrade
          ? new SmartTradeService(effect.ref, smartTrade)
          : null;

        item = generator.next(smartTradeService);
      } else if (isCreateSmartTradeEffect(item.value)) {
        const effect = item.value;

        const smartTrade = await this.control.createSmartTrade(
          effect.ref,
          effect.payload,
        );
        const smartTradeService = new SmartTradeService(effect.ref, smartTrade);

        item = generator.next(smartTradeService);
      } else if (isUseExchangeEffect(item.value)) {
        item = generator.next(this.exchange);
      } else if (isUseIndicatorsEffect(item.value)) {
        const effect = item.value;
        const barSize = effect.payload.barSize as IndicatorBarSize; // @todo fix eslint error
        const { exchangeCode, baseCurrency, quoteCurrency } = this.botConfig;

        console.log(`Compute indicators`, effect.payload);
        const indicators = await computeIndicators({
          exchangeCode,
          symbol: `${baseCurrency}/${quoteCurrency}`,
          barSize,
          untilDate: lastClosedCandleDate(processingDate, barSize),
          indicators: effect.payload.indicators,
        });
        console.log("Indicators computed", indicators);

        item = generator.next(indicators);
      } else {
        console.log(item.value);
        throw new Error("Unsupported effect");
      }
    }
  }
}
