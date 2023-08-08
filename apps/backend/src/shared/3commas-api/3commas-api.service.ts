import { SmartTradesService } from 'src/shared/3commas-api/services/smart-trades.service';

export class ThreeCommasApiService {
  constructor(public smartTrades: SmartTradesService) {}
}
