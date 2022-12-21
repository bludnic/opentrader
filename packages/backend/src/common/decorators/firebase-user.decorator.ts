import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQ_USER_ACCOUNT_KEY } from 'src/common/middlewares/firebase-user.middleware';

export const FirebaseUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request[REQ_USER_ACCOUNT_KEY];
  },
);
