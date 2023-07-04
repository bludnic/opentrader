import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateExchangeAccountDto } from 'src/core/db/firestore/repositories/exchange-account/dto/create-exchange-account.dto';
import { UpdateExchangeAccountDto } from 'src/core/db/firestore/repositories/exchange-account/dto/update-exchange-account.dto';
import { ACCOUNT_COLLECTION } from 'src/core/db/firestore/utils/collections';
import { USER_ID_FIELD_PATH } from 'src/core/db/firestore/utils/constants';
import { ExchangeAccountEntity } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.entity';
import { IExchangeAccount } from 'src/core/db/types/entities/exchange-accounts/exchange-account/exchange-account.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

const converter: firestore.FirestoreDataConverter<IExchangeAccount> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as ExchangeAccountEntity,
};

@Injectable()
export class ExchangeAccountRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(exchangeAccountId: string): Promise<ExchangeAccountEntity> {
    const document = this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .withConverter(converter)
      .doc(exchangeAccountId);
    const documentData = await document.get();

    return new ExchangeAccountEntity(documentData.data());
  }

  async findAll(): Promise<ExchangeAccountEntity[]> {
    const allExchangeAccounts = await this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .withConverter(converter)
      .get();

    const exchangeAccounts = allExchangeAccounts.docs.map(
      (doc) => new ExchangeAccountEntity(doc.data()),
    );

    return exchangeAccounts;
  }

  async findAllByUserId(userId: string): Promise<ExchangeAccountEntity[]> {
    const allExchangeAccounts = await this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .withConverter(converter)
      .where(USER_ID_FIELD_PATH, '==', userId)
      .get();

    const exchangeAccounts = allExchangeAccounts.docs.map(
      (doc) => new ExchangeAccountEntity(doc.data()),
    );

    return exchangeAccounts;
  }

  async create(
    dto: CreateExchangeAccountDto,
    userId: string,
  ): Promise<ExchangeAccountEntity> {
    const document = this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .withConverter(converter)
      .doc(dto.id);

    const createdAt = new Date().getTime();
    const entity: IExchangeAccount = {
      ...dto,
      createdAt,
      userId,
    };

    await document.set(entity);

    const result = await document.get();

    return new ExchangeAccountEntity(result.data());
  }

  async update(
    dto: UpdateExchangeAccountDto,
    accountId: string,
  ): Promise<ExchangeAccountEntity> {
    const document = this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .withConverter(converter)
      .doc(accountId);

    await document.update(dto);

    const result = await document.get();

    return new ExchangeAccountEntity(result.data());
  }
}
