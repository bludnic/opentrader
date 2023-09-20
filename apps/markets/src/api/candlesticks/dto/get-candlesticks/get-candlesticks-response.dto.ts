import { GetCandlestickDto } from './types/get-candlestick.dto';

export class GetCandlesticksResponseDto {
  candlesticks: GetCandlestickDto[];
  count: number;
}
