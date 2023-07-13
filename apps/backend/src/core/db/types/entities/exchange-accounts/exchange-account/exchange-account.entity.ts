import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExchangeCredentialsDto } from 'src/core/db/firestore/repositories/exchange-account/dto/exchange-credentials.dto';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { IExchangeCredentials } from 'src/core/db/types/entities/exchange-accounts/exchange-credentials/exchange-credentials.interface';

export class ExchangeAccountEntity implements IExchangeAccount {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    enum: ExchangeCode,
    enumName: 'ExchangeCode',
  })
  @IsDefined()
  @IsEnum(ExchangeCode)
  exchangeCode: ExchangeCode;

  @ApiProperty({
    type: () => ExchangeCredentialsDto,
  })
  @ValidateNested()
  @Type(() => ExchangeCredentialsDto)
  credentials: IExchangeCredentials;

  userId: string; // owner of the document
  createdAt: number;

  constructor(account: IExchangeAccount) {
    Object.assign(this, account);
  }
}
