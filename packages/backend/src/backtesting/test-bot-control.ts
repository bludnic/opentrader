import { IGridBot } from "src/core/db/types/entities/grid-bots/grid-bot.interface";
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface";
import { UseSmartTradePayload } from "../core/bot-manager/effects/common/types/use-smart-trade-effect";
import { IBotControl } from "../core/bot-manager/types/bot-control.interface";
import { TestingDb } from "./testing-db";
import { BASE_CURRENCY, BOT_ID, EXCHANGE_ACCOUNT_ID, GRID_BOT, QUOTE_CURRENCY } from "./mocks";

export class TestBotControl implements IBotControl {
    public entity: IGridBot = GRID_BOT;

    constructor(private db: TestingDb) {}

    async stop() {
        console.log('Bot stopped')
    }

    async getSmartTrade(key: string): Promise<ISmartTrade | null> {
        const smartTradeRef = this.entity.smartTrades.find(smartTradeRef => smartTradeRef.key === key)

        if (smartTradeRef) {
            return this.db.getSmartTrade(smartTradeRef.smartTradeId);
        }

        return null;
    }

    async createSmartTrade(key: string, payload: UseSmartTradePayload): Promise<ISmartTrade> {
        const smartTrade = this.db.createSmartTrade(key, {
            ...payload,
            exchangeAccountId: EXCHANGE_ACCOUNT_ID,
            botId: BOT_ID
        })

        const newSmartTrades = [...this.entity.smartTrades].filter(
            smartTradeRef => smartTradeRef.key !== key
        )
        newSmartTrades.push({
            key,
            smartTradeId: smartTrade.id
        })

        this.entity.smartTrades = newSmartTrades

        return smartTrade
    }

    id() {
        return BOT_ID
    }

    exchangeAccountId() {
        return EXCHANGE_ACCOUNT_ID
    }

    baseCurrency() {
        return BASE_CURRENCY
    }

    quoteCurrency() {
        return QUOTE_CURRENCY
    }
}