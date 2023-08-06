import { IsDateString, IsDefined, IsNotEmpty } from 'class-validator';

export class RunGridBotBacktestByBotIdDto {
  @IsDefined()
  @IsNotEmpty()
  botId: string;

  /**
   * Run backtest starting from this date in ISO 8061 format. e.g. 2022-01-31
   */
  @IsDefined()
  @IsDateString()
  startDate: string;

  /**
   * Run backtest until this date in ISO 8061 format. e.g. 2023-01-31
   */
  @IsDefined()
  @IsDateString()
  endDate: string;
}
