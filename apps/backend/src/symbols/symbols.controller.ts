import {
  Controller,
  Get,
  Param,
  Inject,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ExchangeFactory,
  ExchangeFactorySymbol,
} from 'src/core/exchanges/exchange.factory';
import { GetSymbolInfoResponseDto } from './dto/get-symbol-info/get-symbol-info-response.dto';
import { GetSymbolsResponseBodyDto } from './dto/get-symbols/get-symbols-response-body.dto';
import { IsValidSymbolIdPipe } from './utils/pipes/is-valid-symbol-id.pipe';

@Controller({
  path: 'symbols',
})
@ApiTags('Symbols')
export class SymbolsController {
  constructor(
    @Inject(ExchangeFactorySymbol)
    private readonly exchangeFactory: ExchangeFactory,
  ) {}

  @Get('/')
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
  async getSymbolInfo(
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
}
