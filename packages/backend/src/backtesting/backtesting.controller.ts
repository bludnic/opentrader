import { Controller, Get, Inject, Param, Scope } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FirebaseUser } from "src/common/decorators/firebase-user.decorator";
import { delay } from "src/common/helpers/delay";
import { IUser } from "src/core/db/types/entities/users/user/user.interface";
import { uniqId } from "src/core/db/utils/uniqId";
import { ExchangeFactory, ExchangeFactorySymbol } from "src/core/exchanges/exchange.factory";
import { ICandlestick } from "src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface";
import { useGridBot } from "src/grid-bot/use-grid-bot";
import { BacktestingService } from "./backtesting.service";
import { ETH_USDT } from './history/ETH_USDT_90_DAYS_REAL_ACCOUNT';
import * as fs from 'fs';
import * as path from 'path';
import { GRID_BOT } from "./mocks";
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

    @Get('/candlesticks/:baseCurrency/:quoteCurrency')
    async candlesticks(
        @Param('baseCurrency') baseCurrency: string,
        @Param('quoteCurrency') quoteCurrency: string,  
    ) {
        const exchangeService = await this.exchangeFactory.createFromExchangeAccountId('okx_real_testing');

        let allCandlesticks: ICandlestick[] = []
        let lastTimestamp: number = undefined

        const days = 90
        const requests = days * 24 * 60 / 100

        for (let i = 0; i < requests; i++) {
            console.log(`Fetch candlesticks page #${i + 1} of ${requests}`)
            const candlesticks = await exchangeService.getCandlesticks({
                bar: '1m',
                symbol: exchangeService.tradingPairSymbol({
                    baseCurrency,
                    quoteCurrency
                }),
                limit: 100,
                after: lastTimestamp
            })
            allCandlesticks = [
                ...allCandlesticks,
                ...candlesticks
            ]

            lastTimestamp = candlesticks[candlesticks.length - 1].timestamp

            await delay(200)
        }

        fs.writeFileSync('./candles.txt', JSON.stringify(allCandlesticks));
        console.log('candles.txt saved succesfully')

        return {
            length: allCandlesticks.length,
            days: allCandlesticks.length / 60 / 24,
            allCandlesticks,
        }
    }
}