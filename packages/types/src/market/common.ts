import { ExchangeCode } from "../common/enums.js";

// e.g. OKX:BTC/USDT
export type MarketId<Base extends string = string, Quote extends string = string> = `${ExchangeCode}:${Base}/${Quote}`;
