import { SellTransaction } from '@bifrost/backtesting';
import { OrderSideEnum } from '@bifrost/types';
import { ApiProperty } from '@nestjs/swagger';

import { TransactionOrderDto } from './types/transaction-order.dto';

export class SellTransactionDto implements SellTransaction {
  smartTradeId: string;
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
