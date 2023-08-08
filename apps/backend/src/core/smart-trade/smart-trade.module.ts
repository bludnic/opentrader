import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';
import { SmartTradePublicService } from "./smart-trade-public.service";
import { SmartTradePrivateService } from "./smart-trade-private.service";
import { SmartTradeSyncService } from "./smart-trade-sync.service";
import { smartTradePublicServiceFactory } from "./smart-trade-public-service.factory";
import { smartTradePrivateServiceFactory } from "./smart-trade-private-service.factory";
import { FirestoreModule } from "src/core/db/firestore/firestore.module";
import { Logger } from '@nestjs/common';
import { exchangeFactory } from "src/core/exchanges/exchange.factory";
import { defaultExchangeServiceProvider } from "src/core/exchanges/utils/default-exchange.factory";

@Module({
    imports: [HttpModule, FirestoreModule],
    exports: [
        SmartTradePublicService,
        SmartTradePrivateService,
        smartTradePublicServiceFactory,
        smartTradePrivateServiceFactory
    ],
    providers: [
        SmartTradePublicService,
        SmartTradePrivateService,
        smartTradePrivateServiceFactory,
        smartTradePublicServiceFactory,
        SmartTradeSyncService,
        Logger,
        exchangeFactory,
        defaultExchangeServiceProvider,
    ]
})
export class SmartTradeModule {}