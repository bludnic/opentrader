import { SymbolEndpoint } from '@bifrost/swagger';
import { decomposeSymbolId } from '@bifrost/tools';
import {
  Controller,
  Get,
  Param,
  Inject,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import { GetCurrentAssetPriceResponseDto } from 'src/symbols/dto/get-current-asset-price/get-current-asset-price-response.dto';
import { GetSymbolInfoResponseDto } from './dto/get-symbol-info/get-symbol-info-response.dto';
import { GetSymbolsResponseBodyDto } from './dto/get-symbols/get-symbols-response-body.dto';
import { IsValidSymbolIdPipe } from './utils/pipes/is-valid-symbol-id.pipe';

@Controller({
  path: 'symbols',
})
@ApiTags(SymbolEndpoint.tagName())
export class SymbolsController {
  constructor(
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
  ) {}

  @Get('/')
  @ApiOperation(SymbolEndpoint.operation('getSymbols'))
  async getSymbols(): Promise<GetSymbolsResponseBodyDto> {
    const exchangeService =
      await this.exchangeFactory.createFromExchangeAccountId(
        'okx_real_testing',
      );

    const symbols = await exchangeService.getSymbols({});

    return {
      symbols,
    };
  }

  @Get('/info')
  @ApiOperation(SymbolEndpoint.operation('getSymbol'))
  async getSymbol(
    @Query('symbolId', IsValidSymbolIdPipe) symbolId: string,
  ): Promise<GetSymbolInfoResponseDto> {
    const exchangeService =
      await this.exchangeFactory.createFromExchangeAccountId(
        'okx_real_testing',
      );

    const symbols = await exchangeService.getSymbols({
      symbolId,
    });

    if (symbols.length === 0) {
      throw new NotFoundException(`Symbol ${symbolId} not found`);
    }

    return {
      symbol: symbols[0],
    };
  }

  @Get('/current-asset-price')
  @ApiOperation(SymbolEndpoint.operation('getSymbolCurrentPrice'))
  async getCurrentAssetPrice(
    @Query('symbolId', IsValidSymbolIdPipe) symbolId: string,
  ): Promise<GetCurrentAssetPriceResponseDto> {
    const exchangeService =
      await this.exchangeFactory.createFromExchangeAccountId(
        'okx_real_testing',
      );

    const { baseCurrency, quoteCurrency } = decomposeSymbolId(symbolId);

    const { price, timestamp } = await exchangeService.getMarketPrice({
      symbol: exchangeService.tradingPairSymbol({
        baseCurrency,
        quoteCurrency,
      }),
    });

    return {
      price,
      timestamp,
    };
  }
}
