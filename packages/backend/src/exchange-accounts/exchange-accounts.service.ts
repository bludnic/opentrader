import { Injectable } from '@nestjs/common';

import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { CreateExchangeAccountRequestBodyDto } from 'src/exchange-accounts/dto/create-exchange-account/create-exchange-account-request-body.dto';
import { UpdateExchangeAccountRequestBodyDto } from 'src/exchange-accounts/dto/update-exchange-account/update-exchange-account-request-body.dto';

@Injectable()
export class ExchangeAccountsService {
  constructor(private readonly firestore: FirestoreService) {}

  async getExchangeAccounts(userId: string) {
    return this.firestore.exchangeAccount.findAllByUserId(userId);
  }

  async getExchangeAccount(accountId: string) {
    return this.firestore.exchangeAccount.findOne(accountId);
  }

  async updateExchangeAccount(
    body: UpdateExchangeAccountRequestBodyDto,
    accountId: string,
  ) {
    return this.firestore.exchangeAccount.update(body, accountId);
  }

  async createExchangeAccount(
    body: CreateExchangeAccountRequestBodyDto,
    user: IUser,
  ) {
    return this.firestore.exchangeAccount.create(body, user.uid);
  }
}
