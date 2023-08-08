import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { IThreeCommasAccountCredentials } from './3commas-account-credentials.interface';

export class ThreeCommasAccountCredentialsEntity
  implements IThreeCommasAccountCredentials
{
  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  secretKey: string;

  @ApiProperty({
    description:
      'If set to `true` then Paper Account will be used, otherwise Real Account will be used.',
  })
  @IsDefined()
  @IsBoolean()
  isPaperAccount: boolean;

  constructor(credentials: IThreeCommasAccountCredentials) {
    Object.assign(this, credentials);
  }
}
