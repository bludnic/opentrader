import { IExchange } from "@bifrost/exchanges";
import { SmartTradeService } from "./smart-trade.service";
import { IBotConfiguration, BotTemplate, IBotControl } from "./types";
import { isReplaceSmartTradeEffect } from "./effects/utils/isReplaceSmartTradeEffect";
import { isUseExchangeEffect } from "./effects/utils/isUseExchangeEffect";
import { isUseSmartTradeEffect } from "./effects/utils/isUseSmartTradeEffect";

export class BotManager<T extends IBotConfiguration> {
  constructor(private control: IBotControl<T>, private exchange: IExchange) {}

  async process(botTemplate: BotTemplate<T>): Promise<void> {
    const generator = botTemplate(this.control);

    console.log("[BotManager] Start processing " + this.control.bot.id);

    let item = generator.next();

    for (; !item.done; ) {
      if (item.value instanceof Promise) {
        const result = await item.value;

        item = generator.next(result);
      } else if (isUseSmartTradeEffect(item.value)) {
        const effect = item.value;

        const smartTrade = await this.control.getOrCreateSmartTrade(
          effect.key,
          effect.payload
        );
        const smartTradeService = new SmartTradeService(effect.key, smartTrade)

        item = generator.next(smartTradeService);
      } else if (isReplaceSmartTradeEffect(item.value)) {
        const effect = item.value;

        const smartTrade = await this.control.replaceSmartTrade(
          effect.key,
          effect.payload
        );
        const smartTradeService = new SmartTradeService(effect.key, smartTrade)

        item = generator.next(smartTradeService);
      } else if (isUseExchangeEffect(item.value)) {
        item = generator.next(this.exchange);
      } else {
        console.log(item.value);
        throw Error("Unsupported effect");
      }
    }

    console.log("[BotManager] End processing " + this.control.bot.id);
  }
}
