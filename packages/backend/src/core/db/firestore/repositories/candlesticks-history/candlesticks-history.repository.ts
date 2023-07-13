import { Injectable, NotFoundException } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CANDLESTICKS_HISTORY_COLLECTION } from 'src/core/db/firestore/utils/collections';
import { ExchangeCode } from 'src/core/db/types/common/enums/exchange-code.enum';
import { ICandlestick } from 'src/core/exchanges/types/exchange/market-data/get-candlesticks/types/candlestick.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';
import { genCandlesticksDocId } from 'src/core/db/firestore/utils/candlesticks/genCandlesticksDocId';
import { CandlesticksHistoryEntity } from 'src/core/db/types/entities/candlesticks-history/candlesticks-history.entity';
import { ICandlesticksHistory } from 'src/core/db/types/entities/candlesticks-history/candlesticks-history.interface';
import { uniqBy } from 'lodash';

const converter: firestore.FirestoreDataConverter<ICandlesticksHistory> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as CandlesticksHistoryEntity,
};

@Injectable()
export class CandlesticksHistoryRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(
    exchangeCode: ExchangeCode,
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<CandlesticksHistoryEntity | null> {
    const docId = genCandlesticksDocId(
      exchangeCode,
      baseCurrency,
      quoteCurrency,
    );

    const document = this.firebase.db
      .collection(CANDLESTICKS_HISTORY_COLLECTION)
      .withConverter(converter)
      .doc(docId);

    const documentData = await document.get();
    const data = documentData.data();

    if (!data) {
      return null;
    }

    return new CandlesticksHistoryEntity(data);
  }

  async create(
    candlesticks: ICandlestick[],
    exchangeCode: ExchangeCode,
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<CandlesticksHistoryEntity> {
    const docId = genCandlesticksDocId(
      exchangeCode,
      baseCurrency,
      quoteCurrency,
    );
    const updatedAt = new Date().getTime();

    const document = this.firebase.db
      .collection(CANDLESTICKS_HISTORY_COLLECTION)
      .withConverter(converter)
      .doc(docId);

    const data: ICandlesticksHistory = {
      exchangeCode,
      candlesticks,
      updatedAt,
      historyDataDownloadingCompleted: false,
    };

    await document.create(data);

    return this.findOne(exchangeCode, baseCurrency, quoteCurrency);
  }

  async update(
    candlesticks: ICandlestick[],
    exchangeCode: ExchangeCode,
    baseCurrency: string,
    quoteCurrency: string,
    earliestCandleTimestamp?: number,
    newestCandleTimestamp?: number

  ): Promise<void> {
    const docId = genCandlesticksDocId(
      exchangeCode,
      baseCurrency,
      quoteCurrency,
    );

    const document = this.firebase.db
      .collection(CANDLESTICKS_HISTORY_COLLECTION)
      .withConverter(converter)
      .doc(docId);

    const documentData = await document.get();
    let data: ICandlesticksHistory | undefined = documentData.data();
    const documentFound = !!data;

    if (!documentFound) {
      data = await this.create([], exchangeCode, baseCurrency, quoteCurrency);
    }

    const updatedAt = new Date().getTime();


    const newDocument: Partial<Omit<ICandlesticksHistory, 'candlesticks'>> &
      Record<
        Extract<keyof ICandlesticksHistory, 'candlesticks'>, firestore.FieldValue
      > = {
      candlesticks: firestore.FieldValue.arrayUnion(...candlesticks),
      updatedAt,
    }

    if (earliestCandleTimestamp !== undefined) {
      newDocument.earliestCandleTimestamp = earliestCandleTimestamp
    }

    if (newestCandleTimestamp !== undefined) {
      newDocument.newestCandleTimestamp = newestCandleTimestamp
    }

    await document.update(newDocument);
  }

  async markHistoryDataAsCompleted(
    exchangeCode: ExchangeCode,
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<void> {
    const docId = genCandlesticksDocId(
      exchangeCode,
      baseCurrency,
      quoteCurrency,
    );

    const document = this.firebase.db
      .collection(CANDLESTICKS_HISTORY_COLLECTION)
      .withConverter(converter)
      .doc(docId);

    await document.update({
      historyDataDownloadingCompleted: true,
    } as Pick<ICandlesticksHistory, 'historyDataDownloadingCompleted'>);
  }
}
