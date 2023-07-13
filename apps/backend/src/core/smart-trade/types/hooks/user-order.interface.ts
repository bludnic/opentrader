import { OrderSideEnum } from "src/core/db/types/common/enums/order-side.enum";

export interface UseOrderParams {
    side: OrderSideEnum;
    quantity: number;
    symbol: string;
    price: number;
}
