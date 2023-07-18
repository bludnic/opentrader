import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { UseSmartTradePayload } from '../effects/common/types/use-smart-trade-effect';

export interface IBotControl {
  stop(): Promise<void>;

  getSmartTrade(key: string): Promise<ISmartTrade | null>;
  createSmartTrade(
    key: string,
    smartTrade: UseSmartTradePayload,
  ): Promise<ISmartTrade>;

  /**
   * Return Bot ID
   */
  id(): string;
  exchangeAccountId(): string;
  baseCurrency(): string;
  quoteCurrency(): string;
}
