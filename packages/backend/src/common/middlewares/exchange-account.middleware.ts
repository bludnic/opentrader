import {
  Injectable,
  NestMiddleware,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { NextFunction, Request } from 'express';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';

export const X_EXCHANGE_ACCOUNT_ID_HEADER_KEY = 'x-exchange-account-id';
export const REQ_EXCHANGE_ACCOUNT_KEY = 'exchangeAccount';

@Injectable()
export class ExchangeAccountMiddleware implements NestMiddleware {
  constructor(private firestore: FirestoreService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const xExchangeAccountId = String(
      req.headers[X_EXCHANGE_ACCOUNT_ID_HEADER_KEY],
    );

    if (!xExchangeAccountId) {
      throw new BadRequestException(
        `The header '${X_EXCHANGE_ACCOUNT_ID_HEADER_KEY}' is required.`,
      );
    }

    try {
      const account = await this.firestore.getExchangeAccount(
        xExchangeAccountId,
      );

      if (!account) {
        throw new NotFoundException(
          `Exchange account with ID: ${xExchangeAccountId} doesn't exist`,
        );
      }

      (req as any)[REQ_EXCHANGE_ACCOUNT_KEY] = account;
    } catch (err) {
      throw new NotFoundException(err.message);
    }

    next();
  }
}
