import { CandlestickDto } from 'src/core/db/entities/dto/candlestick';

export class GetCandlesticksResponseDto {
  candlesticks: CandlestickDto[];
  count: number;
}
