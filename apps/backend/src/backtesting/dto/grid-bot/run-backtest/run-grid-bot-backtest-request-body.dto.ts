import { Type } from 'class-transformer';
import { IsDateString, IsDefined, IsNotEmpty, ValidateNested } from 'class-validator';
import { BacktestGridBotDto } from './types/backtest-grid-bot.dto';

export class RunGridBotBacktestRequestBodyDto {
    @IsDefined()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => BacktestGridBotDto)
    bot: BacktestGridBotDto;

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