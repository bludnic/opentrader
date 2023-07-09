import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { OrderSideEnum } from "./enums/order-side.enum";
import { OrderStatusEnum } from "./enums/order-status.enum";
import { IOrder } from "./order.interface";
import { OrderSide } from "./types/order-side.type";
import { OrderStatus } from "./types/order-status.type";

export class OrderEntity implements IOrder {
    @IsNotEmpty()
    @IsString()
    orderId: string; // exchange-supplied order id

    @IsString()
    clientOrderId?: string; // generated uniq id for exchange

    @IsNotEmpty()
    @IsString()
    price: number;

    @IsNotEmpty()
    @IsString()
    quantity: number;

    @IsDefined()
    @IsNumber()
    fee: number;
    
    @ApiProperty({
      enum: OrderSideEnum,
    })
    side: OrderSide;

    @ApiProperty({
      enum: OrderStatusEnum,
    })
    status: OrderStatus;

    constructor(order: OrderEntity) {
      Object.assign(this, order);
    }
}