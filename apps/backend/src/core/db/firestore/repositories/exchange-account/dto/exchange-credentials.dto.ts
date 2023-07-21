import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ExchangeCode } from '@bifrost/types';
import { IExchangeCredentials } from 'src/core/db/types/entities/exchange-accounts/exchange-credentials/exchange-credentials.interface';

export class ExchangeCredentialsDto implements IExchangeCredentials {
  @ApiProperty({
    enum: ExchangeCode,
    enumName: 'ExchangeCode',
  })
  @IsNotEmpty()
  @IsEnum(ExchangeCode)
  code: ExchangeCode;

  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  secretKey: string;

  @IsNotEmpty()
  @IsString()
  passphrase: string; // or password (depends on the exchange)

  @IsDefined()
  @IsBoolean()
  isDemoAccount: boolean;
}
