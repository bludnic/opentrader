import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ExchangeCode } from 'src/core/db/firestore/collections/exchange-accounts/enums/exchange-code.enum';
import { IExchangeCredentials } from 'src/core/db/firestore/collections/exchange-accounts/types/exchange-credentials.interface';

export class ExchangeCredentialsDto implements IExchangeCredentials {
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
