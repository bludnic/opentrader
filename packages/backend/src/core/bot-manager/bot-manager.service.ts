import { IExchangeService } from "src/core/exchanges/types/exchange-service.interface";
import { SmartTradePublicService } from "src/core/smart-trade/smart-trade-public.service";
import { ISmartTrade } from "../db/types/entities/smart-trade/smart-trade.interface";
import { IUser } from "../db/types/entities/users/user/user.interface";
import { BotTemplate } from "./bot-template/types/bot-template.type";
import { isExchangeEffect } from "./effects/utils/isExchangeEffect";
import { isSmartTradeEffect } from "./effects/utils/isSmartTradeEffect";
import { IBotControl } from "./types/bot-control.interface";

export class BotManagerService {
    constructor(
        private userId: string,
        private bot: IBotControl,
        private exchange: IExchangeService,
        private smartTradePublicService: SmartTradePublicService,
    ) {}

    async process(botTemplate: BotTemplate): Promise<void> {
        const generator = botTemplate(this.bot)

        console.log('[BotManager] Start processing ' + this.bot.id())

        let item = generator.next()

        for (; !item.done;) {
            if (item.value instanceof Promise) {
                console.log('isPromise', item.value)
                const result = await item.value;

                item = generator.next(result);
            } else if (isSmartTradeEffect(item.value)) {
                const effect = item.value;

                let smartTrade: ISmartTrade
                try {
                    // throws error if a Smart Trade with this ID doesn't exists
                    smartTrade = await this.smartTradePublicService.get(effect.payload.id)
                    console.log('[BotManager] SmartTrade already exists', effect.payload.id)
                } catch {
                    console.log('[BotManager] Placing SmartTrade', effect.payload.id)
                    smartTrade = await this.smartTradePublicService.create(
                        effect.payload,
                        this.userId
                    )
                    await this.bot.onCreateSmartTrade(effect.key, smartTrade)
                }

                item = generator.next(smartTrade)
            } else if (isExchangeEffect(item.value)) {
                console.log('isExchangeEffect', item.value)

                item = generator.next(this.exchange)
            } else {
                throw Error('Unsupported effect')
            }
        }

        console.log('[BotManager] End processing ' + this.bot.id())
    }
}