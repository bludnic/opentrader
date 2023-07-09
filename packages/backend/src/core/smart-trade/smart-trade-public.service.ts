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

    create (smartTrade: CreateSmartTradeRequestBodyDto, user: IUser): Promise<ISmartTrade> {
        return this.firestore.smartTrade.create(smartTrade, user.uid)
    }

    cancel() {
        // @todo not implemented
    }
}