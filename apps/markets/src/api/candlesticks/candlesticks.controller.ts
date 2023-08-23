import { decomposeSymbolId } from '@bifrost/tools';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { parseISO } from 'date-fns';

import {
  GetCandlesticksResponseDto,
  GetCandlesticksRequestDto,
} from './dto/get-candlesticks';
import { CandlesticksService } from './candlesticks.service';

@Controller('candlesticks')
@ApiTags('Candlesticks')
export class CandlesticksController {
  constructor(private readonly candlesticksService: CandlesticksService) {}

  @Get()
  async getCandlesticks(
    @Query() query: GetCandlesticksRequestDto,
  ): Promise<GetCandlesticksResponseDto> {
    const { symbolId, timeframe, startDate, endDate } = query;
    const { exchangeCode, currencyPairSymbol } = decomposeSymbolId(symbolId);

    const fromTimestamp = parseISO(startDate).getTime();
    const toTimestamp = parseISO(endDate).getTime();

    const { candlesticks } = await this.candlesticksService.findAll(
      currencyPairSymbol,
      exchangeCode,
      timeframe,
      fromTimestamp,
      toTimestamp,
    );

    return {
      candlesticks,
      count: candlesticks.length,
    };
  }
}
