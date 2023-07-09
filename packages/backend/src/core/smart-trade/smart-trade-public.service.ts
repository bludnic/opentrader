import { Injectable, Logger } from "@nestjs/common";
import { FirestoreService } from "src/core/db/firestore/firestore.service";
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface";
import { IUser } from "src/core/db/types/entities/users/user/user.interface";
import { CreateSmartTradeRequestBodyDto } from "./dto/create-smart-trade/create-smart-trade-request-body.dto";

@Injectable()
export class SmartTradePublicService {
    constructor(
        private firestore: FirestoreService,
        private readonly logger: Logger
    ) {}

    get (smartTradeId: string) {
        return this.firestore.smartTrade.findOne(smartTradeId);
    }

    getAllByUserId(userId: string) {
        return this.firestore.smartTrade.findAllByUserId(userId);
    }

    getAllByBotId(botId: string) {
        return this.firestore.smartTrade.findAllByBotId(botId)
    }

    create (smartTrade: CreateSmartTradeRequestBodyDto, userId: string): Promise<ISmartTrade> {
        return this.firestore.smartTrade.create(smartTrade, userId)
    }

    cancel() {
        // @todo not implemented
    }
}