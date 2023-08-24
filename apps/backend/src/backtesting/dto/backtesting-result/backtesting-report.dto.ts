import { ActiveOrder, ReportResult, Transaction } from '@bifrost/backtesting';
import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BuyTransactionDto } from './transaction/buy-transaction.dto';
import { SellTransactionDto } from './transaction/sell-transaction.dto';
import { ActiveOrderDto } from './active-order/active-order.dto';

@ApiExtraModels(BuyTransactionDto, SellTransactionDto)
export class BacktestingResultDto implements ReportResult {
  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        {
          $ref: getSchemaPath(BuyTransactionDto),
        },
        {
          $ref: getSchemaPath(SellTransactionDto),
        },
      ],
    },
  })
  transactions: Transaction[];

  @ApiProperty({
    type: () => ActiveOrderDto,
    isArray: true,
  })
  @Type(() => ActiveOrderDto)
  activeOrders: ActiveOrder[];
  totalProfit: number;
}
