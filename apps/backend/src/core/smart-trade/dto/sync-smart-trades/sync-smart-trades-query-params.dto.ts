import { IsNotEmpty, IsString } from 'class-validator';

export class SyncSmartTradesQueryParamsDto {
  @IsNotEmpty()
  @IsString()
  exchangeAccountId: string;
}
