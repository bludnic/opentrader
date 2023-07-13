import { OrderStatusEnum } from "src/core/db/types/entities/trade-bot/orders/enums/order-status.enum";
import { IOrder } from "src/core/db/types/entities/trade-bot/orders/order.interface";
import { IPlaceLimitOrderRequest } from "src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface";
import { IPlaceLimitOrderResponse } from "src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-response.interface";

export function fromExchangeOrderToTradeOrder(
    request: IPlaceLimitOrderRequest,
    response: IPlaceLimitOrderResponse
): IOrder {
    return {
        ...request,
        fee: 0,
        orderId: response.orderId,
        status: OrderStatusEnum.Placed
    }
}