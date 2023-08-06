import { SmartTradeDto } from 'src/core/db/firestore/repositories/smart-trade/dto/smart-trade.dto';
import { CandlestickEntity } from 'src/core/db/postgres/entities/candlesticks-history/candlestick/candlestick.entity';
import { TradeDto } from 'src/backtesting/dto/types/trade/trade.dto';

export class RunGridBotBacktestResponseBodyDto {
    candles: CandlestickEntity[];
    trades: TradeDto[];
    smartTrades: SmartTradeDto[];
    finishedSmartTradesCount: number;
    totalProfit: number;
}