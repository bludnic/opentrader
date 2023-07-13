import { Controller, Get, Inject, Scope } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FirebaseUser } from "src/common/decorators/firebase-user.decorator";
import { IUser } from "src/core/db/types/entities/users/user/user.interface";
import { ExchangeFactory, ExchangeFactorySymbol } from "src/core/exchanges/exchange.factory";
import { ICandlestick } from "src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface";
import { BacktestingService } from "./backtesting.service";
import { ETH_USDT } from './history/ETH_USDT_90_DAYS_REAL_ACCOUNT';
import { ITrade } from "./types/trade.interface";
import { convertSmartTradesToTrades } from "./utils/convertSmartTradesToTrades";
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface";

@Controller({
    path: 'backtesting',
    scope: Scope.REQUEST, // @todo do I really need this?
})
@ApiTags('Backtesting')
export class BacktestingController {
    constructor(
        private backtestingService: BacktestingService,
        @Inject(ExchangeFactorySymbol)
        private exchangeFactory: ExchangeFactory,
    ) {

    }

    @Get('/candlesticks-UNI-USDT')
    async candlesticksUniUst(): Promise<{ candles: ICandlestick[] }> {
        return {
            candles: ETH_USDT
        }
    }

    @Get('/test')
    async test(@FirebaseUser() user: IUser): Promise<{
        candles: ICandlestick[],
        trades: ITrade[],
        finishedSmartTradesCount: number,
        totalProfit: number,
        smartTrades: ISmartTrade[]
    }> {
        // return GRID_BOT as any;
      const candles = ETH_USDT // .slice(0, 10080); // aprox: 10 days

      const backtesting = new BacktestingService();
      const { smartTrades, finishedSmartTradesCount, totalProfit } = await backtesting.run(candles);

      const trades = convertSmartTradesToTrades(smartTrades);

      return {
        trades,
        candles,
        finishedSmartTradesCount,
        totalProfit,
        smartTrades
      }
    }
}