import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { Create3CommasAccountDto } from 'src/core/db/firestore/repositories/3commas-account/dto/create-3commas-account.dto';
import { Update3CommasAccountDto } from 'src/core/db/firestore/repositories/3commas-account/dto/update-3commas-account.dto';
import { THREE_COMMAS_EXCHANGE_ACCOUNTS_COLLECTION } from 'src/core/db/firestore/utils/collections';
import { USER_ID_FIELD_PATH } from 'src/core/db/firestore/utils/constants';
import { ThreeCommasAccountEntity } from 'src/core/db/types/entities/3commas-accounts/account/3commas-account.entity';
import { IThreeCommasAccount } from 'src/core/db/types/entities/3commas-accounts/account/3commas-account.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

const converter: firestore.FirestoreDataConverter<IThreeCommasAccount> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as ThreeCommasAccountEntity,
};

@Injectable()
export class ThreeCommasAccountRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(id): Promise<ThreeCommasAccountEntity> {
    const document = this.firebase.db
      .collection(THREE_COMMAS_EXCHANGE_ACCOUNTS_COLLECTION)
      .withConverter(converter)
      .doc(id);
    const documentData = await document.get();

    return new ThreeCommasAccountEntity(documentData.data());
  }

  async findAllByUserId(userId: string): Promise<ThreeCommasAccountEntity[]> {
    const allExchangeAccounts = await this.firebase.db
      .collection(THREE_COMMAS_EXCHANGE_ACCOUNTS_COLLECTION)
      .withConverter(converter)
      .where(USER_ID_FIELD_PATH, '==', userId)
      .get();

    const accounts = allExchangeAccounts.docs.map(
      (doc) => new ThreeCommasAccountEntity(doc.data()),
    );

    return accounts;
  }

  async create(
    dto: Create3CommasAccountDto,
    userId: string,
  ): Promise<ThreeCommasAccountEntity> {
    const document = this.firebase.db
      .collection(THREE_COMMAS_EXCHANGE_ACCOUNTS_COLLECTION)
      .withConverter(converter)
      .doc(dto.id);

    const createdAt = new Date().getTime();
    const entity: IThreeCommasAccount = {
      ...dto,
      createdAt,
      userId,
    };

    await document.set(entity);

    const result = await document.get();

    return new ThreeCommasAccountEntity(result.data());
  }

  async update(
    dto: Update3CommasAccountDto,
    accountId: string,
  ): Promise<ThreeCommasAccountEntity> {
    const document = this.firebase.db
      .collection(THREE_COMMAS_EXCHANGE_ACCOUNTS_COLLECTION)
      .withConverter(converter)
      .doc(accountId);

    await document.update(dto);

    const result = await document.get();

    return new ThreeCommasAccountEntity(result.data());
  }
}
