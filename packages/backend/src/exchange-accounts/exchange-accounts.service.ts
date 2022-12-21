import { Injectable } from '@nestjs/common';

import { IExchangeAccount } from 'src/core/db/firestore/collections/exchange-accounts/exchange-account.interface';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IUser } from 'src/core/db/firestore/types/users/user/user.interface';
import { CreateExchangeAccountRequestBodyDto } from 'src/exchange-accounts/dto/create-exchange-account/create-exchange-account-request-body.dto';

@Injectable()
export class ExchangeAccountsService {
  constructor(private readonly firestore: FirestoreService) {}

  async getExchangeAccounts(userId: string) {
    return this.firestore.getExchangeAccountsByUserId(userId);
  }

  async createExchangeAccount(
    body: CreateExchangeAccountRequestBodyDto,
    user: IUser,
  ) {
    const newExchangeAccount: IExchangeAccount = {
      ...body,
      userId: user.uid,
    };

    return this.firestore.createExchangeAccount(newExchangeAccount);
  }
}
