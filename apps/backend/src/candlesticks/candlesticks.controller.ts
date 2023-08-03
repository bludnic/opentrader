import { CandlesticksHistoryEndpoint } from '@bifrost/swagger';
import { BarSize } from '@bifrost/types';
import {
  Controller,
  Get,
  Inject,
  Logger,
  NotFoundException,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCandlesticksHistoryResponseDto } from 'src/candlesticks/dto/get-candlesticks-history/get-candlesticks-history-response.dto';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { composeEntityId } from 'src/core/db/postgres/utils/candlesticks-history/composeEntityId';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import {
  CandlesticksServiceFactory,
  CandlesticksServiceFactorySymbol,
} from 'src/candlesticks/candlesticks-service.factory';
import { IsValidBarSizePipe } from 'src/symbols/utils/pipes/is-valid-bar-size-pipe';
import { IsValidSymbolIdPipe } from 'src/symbols/utils/pipes/is-valid-symbol-id.pipe';

@Controller({
  path: 'candlesticks',
})
@ApiTags(CandlesticksHistoryEndpoint.tagName())
export class CandlesticksController {
  constructor(
    private readonly firestore: FirestoreService,
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
    private readonly logger: Logger,
    @Inject(CandlesticksServiceFactorySymbol)
    private readonly candlesticksServiceFactory: CandlesticksServiceFactory,
  ) {}

  @Get('/history')
  @ApiOperation(CandlesticksHistoryEndpoint.operation('getCandlesticksHistory'))
  async getCandlesticksHistory(
    @Query('symbolId', IsValidSymbolIdPipe) symbolId: string,
    @Query('barSize', IsValidBarSizePipe) barSize: BarSize,
  ): Promise<GetCandlesticksHistoryResponseDto> {
    const entityId = composeEntityId(symbolId, barSize);

    const candlesticksService =
      await this.candlesticksServiceFactory.fromExchangeAccountId(
        'okx_real_testing',
      );

    const history = await candlesticksService.candlesticksHistory.findOne({
      where: {
        id: entityId,
      },
      relations: ['candlesticks'],
    });

    if (!history) {
      throw new NotFoundException(
        `[CandlesticksController] Not found history data for ${entityId} symbol`,
      );
    }

    return {
      history,
    };
  }

  @Put('/history')
  @ApiOperation(
    CandlesticksHistoryEndpoint.operation('downloadCandlesticksHistory'),
  )
  async downloadCandlesticksHistory(
    @Query('symbolId', IsValidSymbolIdPipe) symbolId: string,
    @Query('barSize', IsValidBarSizePipe) barSize: BarSize,
  ) {
    const candlesticksService =
      await this.candlesticksServiceFactory.fromExchangeAccountId(
        'okx_real_testing',
      );

    await candlesticksService.downloadHistory(symbolId, barSize);

    return {
      polling: true,
    };
  }
}
