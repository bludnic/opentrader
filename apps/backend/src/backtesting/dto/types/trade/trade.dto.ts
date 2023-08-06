import { OrderSideEnum } from "@bifrost/types";
import { ITrade } from "./trade.interface";

export class TradeDto implements ITrade {
    smartTradeId: string;
    side: OrderSideEnum;
    price: number;
    quantity: number;
    time: number;
}