import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ThreeCommasAccountCredentialsDto } from 'src/core/db/firestore/repositories/3commas-account/dto/3commas-account-credentials.dto';
import { ThreeCommasAccountCredentialsEntity } from 'src/core/db/types/entities/3commas-accounts/account-credentials/3commas-account-credentials.entity';
import { IThreeCommasAccountCredentials } from 'src/core/db/types/entities/3commas-accounts/account-credentials/3commas-account-credentials.interface';
import { IThreeCommasAccount } from './3commas-account.interface';

export class ThreeCommasAccountEntity implements IThreeCommasAccount {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: () => ThreeCommasAccountCredentialsDto,
  })
  @ValidateNested()
  @Type(() => ThreeCommasAccountCredentialsEntity)
  credentials: IThreeCommasAccountCredentials;

  userId: string; // owner of the document
  createdAt: number;

  constructor(account: IThreeCommasAccount) {
    Object.assign(this, account);
  }
}
