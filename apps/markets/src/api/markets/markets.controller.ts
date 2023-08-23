import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  CreateMarketRequestDto,
  CreateMarketResponseDto,
} from './dto/create-market';
import { GetMarketsRequestDto, GetMarketsResponseDto } from './dto/get-markets';
import { MarketsService } from './markets.service';

@Controller('markets')
@ApiTags('Markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Post()
  async createMarket(
    @Body() body: CreateMarketRequestDto,
  ): Promise<CreateMarketResponseDto> {
    const { symbol, exchangeCode } = body;

    return this.marketsService.create(symbol, exchangeCode);
  }

  @Get()
  async getMarkets(
    @Query() params: GetMarketsRequestDto,
  ): Promise<GetMarketsResponseDto> {
    if (params.exchangeCode) {
      return this.marketsService.findAllByExchange(params.exchangeCode);
    }

    return this.marketsService.findAll();
  }
}
