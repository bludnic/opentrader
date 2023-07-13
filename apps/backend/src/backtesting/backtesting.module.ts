import { Logger, Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';
import { CoreModule } from "src/core/core.module";
import { BacktestingController } from "./backtesting.controller";
import { BacktestingService } from "./backtesting.service";
import { exchangeFactory } from "src/core/exchanges/exchange.factory";

@Module({
    imports: [CoreModule, HttpModule],
    exports: [],
    controllers: [BacktestingController],
    providers: [
      BacktestingService,
      Logger,
      exchangeFactory
    ], 
})
export class BacktestingModule {}