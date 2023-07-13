import { IsDecimal, IsDefined, IsNumber } from "class-validator";
import { ICandlestick } from "src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface";

export class CandlestickEntity implements ICandlestick {
    @IsDefined()
    @IsNumber()
    open: number;

    @IsDefined()
    @IsNumber()
    high: number;

    @IsDefined()
    @IsNumber()
    low: number;

    @IsDefined()
    @IsNumber()
    close: number;

    /**
     * Data generation time, Unix timestamp format in milliseconds, e.g. `1597026383085`
     */
    @IsDefined()
    @IsNumber()
    timestamp: number;

    constructor(candlestick: ICandlestick) {
        Object.assign(this, candlestick);
    }
}