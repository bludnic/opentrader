import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQ_EXCHANGE_ACCOUNT_KEY } from 'src/common/middlewares/exchange-account.middleware';

export const ExchangeAccount = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request[REQ_EXCHANGE_ACCOUNT_KEY];
  },
);
