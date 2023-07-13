import { IOrder } from "src/core/db/types/entities/trade-bot/orders/order.interface"
import { Effect } from "../common/effect"

export type OrderEffect = Effect<'order', {
    key: string,
    order: IOrder
}>