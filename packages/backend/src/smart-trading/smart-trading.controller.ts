import {
    Body,
    Controller,
    Get,
    Inject,
    Patch,
    Post,
    Query,
    Scope,
    InternalServerErrorException,
    Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { SmartTradePrivateServiceFactory, SmartTradePrivateServiceFactorySymbol } from 'src/core/smart-trade/smart-trade-private-service.factory';
import { SmartTradePublicServiceFactory, SmartTradePublicServiceFactorySymbol } from 'src/core/smart-trade/smart-trade-public-service.factory';
import { CreateSmartTradeRequestBodyDto } from 'src/core/smart-trade/dto/create-smart-trade/create-smart-trade-request-body.dto';
import { CreateSmartTradeResponseBodyDto } from 'src/core/smart-trade/dto/create-smart-trade/create-smart-trade-response-body.dto';
import { GetSmartTradeResponseBodyDto } from 'src/core/smart-trade/dto/get-smart-trade/get-smart-trade-response-body.dto';
import { GetSmartTradesListResponseDto } from 'src/core/smart-trade/dto/get-smart-trades-list/get-smart-trades-list-response.dto';
import { SyncSmartTradesQueryParamsDto } from 'src/core/smart-trade/dto/sync-smart-trades/sync-smart-trades-query-params.dto';
import { SyncSmartTradesResponseBodyDto } from 'src/core/smart-trade/dto/sync-smart-trades/sync-smart-trades-response-body.dto';
import { ExchangeFactory, ExchangeFactorySymbol } from 'src/core/exchanges/exchange.factory';

@Controller({
    path: 'smart-trading',
    scope: Scope.REQUEST,
})
@ApiTags('Smart Trading')
export class SmartTradingController {
    constructor(
        @Inject(SmartTradePublicServiceFactorySymbol)
        private smartTradePublicServiceFactory: SmartTradePublicServiceFactory,
        @Inject(SmartTradePrivateServiceFactorySymbol)
        private smartTradePrivateServiceFactory: SmartTradePrivateServiceFactory,
        private firestore: FirestoreService,

        // experiments @todo remove
        @Inject(ExchangeFactorySymbol)
        private exchangeFactory: ExchangeFactory,
    ) { }

    @Get()
    async getSmartTrades(@FirebaseUser() user: IUser): Promise<GetSmartTradesListResponseDto> {
        const smartTradePublicService = this.smartTradePublicServiceFactory.create()
        const smartTrades = await smartTradePublicService.getAllByUserId(user.uid);

        return {
            smartTrades,
        };
    }

    @Get('/info/:id')
    async getSmartTrade(@Param('id') smartTradeId: string): Promise<GetSmartTradeResponseBodyDto> {
        const smartTradePublicService = this.smartTradePublicServiceFactory.create()

        const smartTrade = await smartTradePublicService.get(smartTradeId);

        return {
            smartTrade,
        };
    }

    @Post('/create')
    async createSmartTrade(
        @Body() body: CreateSmartTradeRequestBodyDto,
        @FirebaseUser() user: IUser,
    ): Promise<CreateSmartTradeResponseBodyDto> {
        const smartTradePublicService = this.smartTradePublicServiceFactory.create();

        const smartTrade = await smartTradePublicService.create(body, user.uid);

        return {
            smartTrade,
        };
    }

    @Patch('/sync')
    async syncSmartTrades(
        @Query() queryParams: SyncSmartTradesQueryParamsDto,
    ): Promise<SyncSmartTradesResponseBodyDto> {
        const { exchangeAccountId } = queryParams;

        const smartTradePrivateService = await this.smartTradePrivateServiceFactory
            .fromExchangeAccountId(exchangeAccountId);

        try {
            const syncedSmartTrades = await smartTradePrivateService.syncSmartTrades(exchangeAccountId);

            return {
                syncedSmartTrades,
                message: `[SmartTradeController] SmartTrades of the exchangeAccount ID: ${exchangeAccountId} have been synced successfully`
            };
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }
}
