import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface";

export interface IBotControl {
    stop(): Promise<void>;
    onCreateSmartTrade(key: string, smartTrade: ISmartTrade): Promise<void>;
    /**
     * Return Bot ID
     */
    id(): string;
    exchangeAccountId(): string;
    baseCurrency(): string;
    quoteCurrency(): string;
}