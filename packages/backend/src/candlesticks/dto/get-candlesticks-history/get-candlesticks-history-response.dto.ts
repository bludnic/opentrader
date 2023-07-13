import { PickType } from "@nestjs/swagger";
import { CandlesticksHistoryDto } from "src/core/db/firestore/repositories/candlesticks-history/dto/candlesticks-history.dto";

export class GetCandlesticksHistoryReseponseDto extends PickType(CandlesticksHistoryDto, ['candlesticks', 'updatedAt']) {}