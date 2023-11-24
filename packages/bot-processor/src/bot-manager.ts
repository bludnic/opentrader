import type { IExchange } from "@opentrader/exchanges";
import type { TBotContext } from "#bot-processor/types/bot/bot-context.type";
import { createContext } from "./utils/createContext";
import { SmartTradeService } from "./smart-trade.service";
import type { IBotConfiguration, BotTemplate, IBotControl } from "./types";
import { isReplaceSmartTradeEffect } from "./effects/utils/isReplaceSmartTradeEffect";
import { isUseExchangeEffect } from "./effects/utils/isUseExchangeEffect";
import { isUseSmartTradeEffect } from "./effects/utils/isUseSmartTradeEffect";
import { isCancelSmartTradeEffect } from "./effects/utils/isCancelSmartTradeEffect";

export class BotManager<T extends IBotConfiguration> {
  constructor(
    private control: IBotControl<T>,
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
    const generator = this.botTemplate(context);

    let item = generator.next();

    for (; !item.done; ) {
      if (item.value instanceof Promise) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- will be typed later
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
      } else if (isUseExchangeEffect(item.value)) {
        item = generator.next(this.exchange);
      } else {
        console.log(item.value);
        throw new Error("Unsupported effect");
      }
    }
  }
}
