import { SellTransaction } from '@bifrost/backtesting';
import { OrderSideEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';

import { TransactionOrderDto } from './types/transaction-order.dto';

export class SellTransactionDto implements SellTransaction {
  @ApiProperty({
    enum: OrderSideEnum,
    enumName: 'OrderSideEnum',
  })
  side: OrderSideEnum.Sell;
  quantity: number;
  buy: TransactionOrderDto;
  sell: TransactionOrderDto;
  profit: number;
}
