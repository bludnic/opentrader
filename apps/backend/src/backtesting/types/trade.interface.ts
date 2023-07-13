import { OrderSideEnum } from "src/core/db/types/common/enums/order-side.enum";

export interface ITrade {
    smartTradeId: string;
    side: OrderSideEnum,
    price: number;
    quantity: number;
    time: number;
}