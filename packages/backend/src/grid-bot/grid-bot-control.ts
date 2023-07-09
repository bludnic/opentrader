import { Logger } from "@nestjs/common"
import { IBotControl } from "src/core/bot-manager/types/bot-control.interface"
import { FirestoreService } from "src/core/db/firestore/firestore.service"
import { GridBotEntity } from "src/core/db/types/entities/grid-bots/grid-bot.entity"
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface"
import { IExchangeService } from "src/core/exchanges/types/exchange-service.interface"

export class GridBotControl implements IBotControl {
    constructor(
        private exchangeService: IExchangeService,
        public entity: GridBotEntity,
        private firestore: FirestoreService,
        private logger: Logger,
    ) {}

    async stop() {
        this.logger.debug('[GridBotControl] Stop command received')
    }

    async onCreateSmartTrade(key: string, smartTrade: ISmartTrade): Promise<void> {
        this.logger.debug(`[GridBotControl] onCreateSmartTrade (key:${key})`, smartTrade)

        await this.firestore.gridBot.updateSmartTradeRef({
            key,
            smartTradeId: smartTrade.id
        }, this.entity.id)

        this.logger.debug(`[GridBotControl] Smart Trade with (key:${key}) was saved to DB`)
    }

    id() {
        return this.entity.id
    }

    baseCurrency() {
        return this.entity.baseCurrency
    }

    quoteCurrency() {
        return this.entity.quoteCurrency
    }

    exchangeAccountId() {
        return this.entity.exchangeAccountId
    }
}