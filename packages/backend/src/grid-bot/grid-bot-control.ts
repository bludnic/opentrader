import { Logger } from "@nestjs/common"
import { UseSmartTradePayload } from "src/core/bot-manager/effects/common/types/use-smart-trade-effect"
import { IBotControl } from "src/core/bot-manager/types/bot-control.interface"
import { FirestoreService } from "src/core/db/firestore/firestore.service"
import { CreateSmartTradeDto } from "src/core/db/firestore/repositories/smart-trade/dto/create-smart-trade/create-smart-trade.dto"
import { GridBotEntity } from "src/core/db/types/entities/grid-bots/grid-bot.entity"
import { IExchangeService } from "src/core/exchanges/types/exchange-service.interface"
import { SmartTradePublicService } from "src/core/smart-trade/smart-trade-public.service"

export class GridBotControl implements IBotControl {
    constructor(
        private smartTradePublicService: SmartTradePublicService,
        private exchangeService: IExchangeService,
        public entity: GridBotEntity,
        private firestore: FirestoreService,
        private logger: Logger,
    ) {}

    async stop() {
        this.logger.debug('[GridBotControl] Stop command received')
    }

    async getSmartTrade(key: string) {
        const smartTradeRef = this.entity.smartTrades.find(smartTrade => smartTrade.key === key);

        if (smartTradeRef) {
            try {
                const smartTrade = await this.firestore.smartTrade.findOne(smartTradeRef.smartTradeId);

                return smartTrade
            } catch {
                return null; // throws error if not found
            }
        }

        return null;
    }

    async createSmartTrade(key: string, payload: UseSmartTradePayload) {
        this.logger.debug(`[GridBotControl] createSmartTrade (key:${key})`)

        const dto: CreateSmartTradeDto = {
            ...payload,
            botId: this.entity.id,
            exchangeAccountId: this.entity.exchangeAccountId
        }
        const smartTrade = await this.smartTradePublicService.create(dto, this.entity.userId)

        await this.firestore.gridBot.updateSmartTradeRef({
            key,
            smartTradeId: smartTrade.id
        }, this.entity.id);

        this.logger.debug(`[GridBotControl] Smart Trade with (key:${key}) was saved to DB`)

        return smartTrade;
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