import { LineData } from "lightweight-charts";
import { GridBotE2ETestingData } from "../grid-bot-e2e-testing-data";

export function lineSeriesFromE2EData(
  e2eData: GridBotE2ETestingData[]
): LineData[] {
  return e2eData.map((e2e) => ({
    time: e2e.time,
    value: e2e.price,
  }));
}
