import { Injectable } from '@nestjs/common';
import { SmartTradesService } from 'src/shared/3commas-api/services/smart-trades.service';

@Injectable()
export class ThreeCommasApiService {
  constructor(public smartTrades: SmartTradesService) {}
}
