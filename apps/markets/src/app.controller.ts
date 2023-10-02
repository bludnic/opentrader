import { ExchangeCode } from '@opentrader/types';
import { Controller, Get } from '@nestjs/common';
import { TestDto } from 'src/test.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async test(): Promise<TestDto> {
    return {
      prop: ExchangeCode.OKX,
    };
  }
}
