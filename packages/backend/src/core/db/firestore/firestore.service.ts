import { Injectable } from '@nestjs/common';
import { IUser } from 'src/core/db/firestore/types/users/user/user.interface';
import { USER_ID_FIELD_PATH } from 'src/core/db/firestore/utils/constants';
import { mapUserClaims } from 'src/core/db/firestore/utils/user/mapUserClaims';
import { InjectFirebaseAdmin, FirebaseAdmin } from 'src/core/firebase';
import { IBotFirestore } from 'src/core/db/firestore/collections/bots/bot-firestore.interface';
import { IDeal } from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { IExchangeAccount } from 'src/core/db/firestore/collections/exchange-accounts/exchange-account.interface';
import { ICreateBotParams } from 'src/core/db/firestore/types/grid-bots/create-bot/create-bot-params.interface';
import { IGetBotParams } from 'src/core/db/firestore/types/grid-bots/get-bot/get-bot-params.interface';
import { IUpdateBotParams } from 'src/core/db/firestore/types/grid-bots/update-bot/update-bot-params.interface';
import {
  ACCOUNT_COLLECTION,
  BOT_COLLECTION,
} from 'src/core/db/firestore/utils/collections';

@Injectable()
export class FirestoreService {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async getUserByIdToken(idToken: string): Promise<IUser> {
    const { uid } = await this.firebase.auth.verifyIdToken(idToken, true);
    const userRecord = await this.firebase.auth.getUser(uid);

    const user: IUser = {
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      customClaims: mapUserClaims(userRecord.customClaims),
    };

    return user;
  }

  async createBot(params: ICreateBotParams): Promise<IBotFirestore> {
    const createdAt = new Date().getTime();

    const document = this.firebase.db.collection(BOT_COLLECTION).doc(params.id);
    const documentData: IBotFirestore = {
      ...params,
      createdAt,
      deals: [],
    };

    await document.set(documentData);

    return documentData;
  }

  async getBot(params: IGetBotParams): Promise<IBotFirestore | null> {
    const { id } = params;
    const document = this.firebase.db.collection(BOT_COLLECTION).doc(id);
    const documentData = await document.get();

    const data: IBotFirestore = (documentData.data() as IBotFirestore) || null; // type or null

    return data;
  }

  async updateBot(params: IUpdateBotParams) {
    const { id, ...rest } = params;

    const document = this.firebase.db.collection(BOT_COLLECTION).doc(id);
    const writeResult = await document.update(rest);

    return writeResult;
  }

  async getBots(): Promise<IBotFirestore[]> {
    const allBots = await this.firebase.db.collection(BOT_COLLECTION).get();

    const bots = allBots.docs.map((doc) => doc.data());

    return bots as IBotFirestore[];
  }

  async updateDeals(botId: string, deals: IDeal[]): Promise<void> {
    const document = this.firebase.db.collection(BOT_COLLECTION).doc(botId);

    const newBot: Partial<IBotFirestore> = {
      deals,
    };
    await document.update(newBot);
  }

  async updateDeal(orderId: string, botId: string, deal: IDeal): Promise<void> {
    const bot = await this.getBot({
      id: botId,
    });

    const newDeals = bot.deals.map((dealDb) => {
      if (dealDb.id === deal.id) {
        return deal;
      }

      return dealDb;
    });

    const newBot: IBotFirestore = {
      ...bot,
      deals: newDeals,
    };

    await this.updateBot(newBot);
  }

  async getExchangeAccount(
    accountId: string,
  ): Promise<IExchangeAccount | null> {
    const document = this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .doc(accountId);
    const documentData = await document.get();

    const data: IExchangeAccount =
      (documentData.data() as IExchangeAccount) || null; // type or null

    return data;
  }

  async getExchangeAccountsByUserId(
    userId: string,
  ): Promise<IExchangeAccount[]> {
    const allExchangeAccounts = await this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .where(USER_ID_FIELD_PATH, '==', userId)
      .get();

    const exchangeAccounts = allExchangeAccounts.docs.map((doc) => doc.data());

    return exchangeAccounts as IExchangeAccount[];
  }

  async createExchangeAccount(
    exchangeAccount: IExchangeAccount,
  ): Promise<IExchangeAccount> {
    const converter = {
      toFirestore: (data: IExchangeAccount) => data,
      fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
        snap.data() as IExchangeAccount,
    };

    const document = this.firebase.db
      .collection(ACCOUNT_COLLECTION)
      .withConverter(converter)
      .doc(exchangeAccount.id);

    await document.set(exchangeAccount);

    const result = await document.get();

    return result.data();
  }
}
