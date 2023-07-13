import { IsNotEmpty, IsString } from 'class-validator';

export class SyncBotQueryParamsDto {
  @IsNotEmpty()
  @IsString()
  botId: string;
}
