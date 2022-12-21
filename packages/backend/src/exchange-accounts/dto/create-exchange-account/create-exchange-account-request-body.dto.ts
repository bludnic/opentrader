import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExchangeCode } from 'src/core/db/firestore/collections/exchange-accounts/enums/exchange-code.enum';
import { ExchangeCredentialsDto } from 'src/exchange-accounts/dto/common/exchange-credentials.dto';

export class CreateExchangeAccountRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsDefined()
  @IsEnum(ExchangeCode)
  exchangeCode: ExchangeCode;

  @ValidateNested()
  @Type(() => ExchangeCredentialsDto)
  credentials: ExchangeCredentialsDto;
}
