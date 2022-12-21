import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExchangeCode } from 'src/core/db/firestore/collections/exchange-accounts/enums/exchange-code.enum';
import { IExchangeAccount } from 'src/core/db/firestore/collections/exchange-accounts/exchange-account.interface';
import { ExchangeCredentialsDto } from 'src/exchange-accounts/dto/common/exchange-credentials.dto';

export class ExchangeAccountDto implements IExchangeAccount {
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

  @IsNotEmpty()
  @IsString()
  userId: string; // owner of the document
}
