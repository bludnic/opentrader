import { Injectable } from '@nestjs/common';
import { Create3CommasAccountRequestBodyDto } from './dto/create-account/create-3commas-account-request-body.dto';
import { Update3CommasAccountRequestBodyDto } from './dto/update-account/update-3commas-account-request-body.dto';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';

@Injectable()
export class ThreeCommasAccountsService {
  constructor(private readonly firestore: FirestoreService) {}

  async getAccounts(userId: string) {
    return this.firestore.threeCommasAccount.findAllByUserId(userId);
  }

  async getAccount(accountId: string) {
    return this.firestore.threeCommasAccount.findOne(accountId);
  }

  async updateAccount(
    body: Update3CommasAccountRequestBodyDto,
    accountId: string,
  ) {
    return this.firestore.threeCommasAccount.update(body, accountId);
  }

  async createAccount(body: Create3CommasAccountRequestBodyDto, user: IUser) {
    return this.firestore.threeCommasAccount.create(body, user.uid);
  }
}
