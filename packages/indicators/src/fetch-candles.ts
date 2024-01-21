import axios from "axios";
import type { OHLCVData, OHLCVRequest, OHLCVResponse } from "./types";

export async function fetchCandles(params: OHLCVRequest): Promise<OHLCVData[]> {
  console.log("Fetch candles", params);

  const { data } = await axios.get<OHLCVResponse>(
    `${process.env.NEXT_PUBLIC_CANDLES_SERVICE_API_URL}/api/trpc/candles.list`,
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_CANDLES_SERVICE_API_KEY,
      },
      params: {
        input: JSON.stringify(params),
      },
    },
  );

  return data.result.data;
}
