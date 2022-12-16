import { OkxExchangeService } from 'src/core/exchanges/okx/okx-exchange.service';
import { OKXClientService } from 'src/core/exchanges/okx/okx-client.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { defaultExchangeContext } from 'src/core/exchanges/utils/default-exchange-context';

@Module({
  imports: [HttpModule],
  exports: [OkxExchangeService],
  controllers: [],
  providers: [OkxExchangeService, OKXClientService, defaultExchangeContext],
})
export class OkxExchangeModule {}
