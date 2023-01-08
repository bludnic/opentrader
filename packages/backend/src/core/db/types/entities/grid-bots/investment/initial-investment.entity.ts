import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { BaseCurrencyInvestmentDto } from 'src/core/db/firestore/repositories/grid-bot/dto/base-currency-investment.dto';
import { QuoteCurrencyInvestmentDto } from 'src/core/db/firestore/repositories/grid-bot/dto/quote-currency-investment.dto';
import { IBaseCurrencyInvestment } from 'src/core/db/types/entities/grid-bots/investment/types/base-currency-investment.interface';
import { IQuoteCurrencyInvestment } from 'src/core/db/types/entities/grid-bots/investment/types/quote-currency-investment.interface';
import { InitialInvestment } from './initial-investment.interface';

export class InitialInvestmentEntity implements InitialInvestment {
  @ApiProperty({
    type: () => BaseCurrencyInvestmentDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => BaseCurrencyInvestmentDto)
  baseCurrency: IBaseCurrencyInvestment;

  @ApiProperty({
    type: () => QuoteCurrencyInvestmentDto,
  })
  @IsDefined()
  @ValidateNested()
  @Type(() => QuoteCurrencyInvestmentDto)
  quoteCurrency: IQuoteCurrencyInvestment;
}
