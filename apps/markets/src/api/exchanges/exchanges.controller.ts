import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateExchangeRequestDto } from './dto/create-exchange';

import { GetExchangesResponseDto } from './dto/get-exchanges';
import { ExchangesService } from './exchanges.service';

@Controller('exchanges')
@ApiTags('Exchanges')
export class ExchangesController {
  constructor(private readonly exchangeService: ExchangesService) {}

  @Post()
  async createExchange(@Body() body: CreateExchangeRequestDto) {
    const { code, name } = body;
    console.log('body', body)

    return this.exchangeService.create(code, name);
  }

  @Get()
  async getExchanges(): Promise<GetExchangesResponseDto> {
    return this.exchangeService.findAll();
  }
}
