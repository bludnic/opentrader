import { BuyTransaction } from '@bifrost/backtesting';
import { OrderSideEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';

import { TransactionOrderDto } from './types/transaction-order.dto';

export class BuyTransactionDto implements BuyTransaction {
  smartTradeId: string;
  @ApiProperty({
    enum: OrderSideEnum,
    enumName: 'OrderSideEnum',
  })
  side: OrderSideEnum.Buy;
  quantity: number;
  buy: TransactionOrderDto;
  sell?: TransactionOrderDto;
  profit: number;
}
