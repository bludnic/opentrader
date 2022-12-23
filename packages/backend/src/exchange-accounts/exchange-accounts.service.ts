import { Injectable } from '@nestjs/common';

import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { CreateExchangeAccountDto } from 'src/core/db/firestore/repositories/exchange-account/dto/create-exchange-account.dto';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { CreateExchangeAccountRequestBodyDto } from 'src/exchange-accounts/dto/create-exchange-account/create-exchange-account-request-body.dto';

@Injectable()
export class ExchangeAccountsService {
  constructor(private readonly firestore: FirestoreService) {}

  async getExchangeAccounts(userId: string) {
    return this.firestore.exchangeAccount.findAllByUserId(userId);
  }

  async createExchangeAccount(
    body: CreateExchangeAccountRequestBodyDto,
    user: IUser,
  ) {
    return this.firestore.exchangeAccount.create(body, user.uid);
  }
}
