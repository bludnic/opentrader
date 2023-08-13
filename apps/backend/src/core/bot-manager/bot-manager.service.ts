import { IExchange } from '@bifrost/exchanges';
import { ISmartTrade } from '../db/types/entities/smart-trade/smart-trade.interface';
import { BotTemplate } from './bot-template/types/bot-template.type';
import { isUseExchangeEffect } from './effects/utils/isUseExchangeEffect';
import { isReplaceSmartTradeEffect } from './effects/utils/isReplaceSmartTradeEffect';
import { isUseSmartTradeEffect } from './effects/utils/isUseSmartTradeEffect';
import { IBotControl } from './types/bot-control.interface';

export class BotManagerService {
  constructor(private bot: IBotControl, private exchange: IExchange) {}

  async process(botTemplate: BotTemplate): Promise<void> {
    const generator = botTemplate(this.bot);

    console.log('[BotManager] Start processing ' + this.bot.id());

    let item = generator.next();

    for (; !item.done; ) {
      if (item.value instanceof Promise) {
        const result = await item.value;

        item = generator.next(result);
      } else if (isUseSmartTradeEffect(item.value)) {
        const effect = item.value;

        let smartTrade: ISmartTrade | null = await this.bot.getSmartTrade(
          effect.key,
        );

        if (smartTrade) {
          // console.log('[BotManager] SmartTrade already exists', smartTrade.id)
        } else {
          console.log('[BotManager] Placing SmartTrade', effect.key);
          smartTrade = await this.bot.createSmartTrade(
            effect.key,
            effect.payload,
          );
        }

        item = generator.next(smartTrade);
      } else if (isReplaceSmartTradeEffect(item.value)) {
        const effect = item.value;
        const { buyOrder, sellOrder, quantity, baseCurrency, quoteCurrency } =
          effect.payload;

        console.log('[BotManager] Replacing SmartTrade', effect.key);
        let st: ISmartTrade | null = await this.bot.getSmartTrade(effect.key); // todo remove
        console.log(st);

        const smartTrade = await this.bot.createSmartTrade(effect.key, {
          buy: { price: buyOrder.price },
          sell: { price: sellOrder.price },
          quantity,
          baseCurrency,
          quoteCurrency,
        });

        item = generator.next(smartTrade);
      } else if (isUseExchangeEffect(item.value)) {
        item = generator.next(this.exchange);
      } else {
        throw Error('Unsupported effect');
      }
    }

    console.log('[BotManager] End processing ' + this.bot.id());
  }
}
