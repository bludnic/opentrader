import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateCompletedDealDto } from 'src/core/db/firestore/repositories/grid-bot-completed-deals/dto/create-completed-deal.dto';
import { BOT_COMPLETED_DEALS } from 'src/core/db/firestore/utils/collections';
import { CompletedDealEntity } from 'src/core/db/types/entities/grid-bots/completed-deals/completed-deal.entity';
import { ICompletedDeal } from 'src/core/db/types/entities/grid-bots/completed-deals/completed-deal.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

const converter: firestore.FirestoreDataConverter<ICompletedDeal> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as CompletedDealEntity,
};

@Injectable()
export class GridBotCompletedDealsRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(id: string): Promise<CompletedDealEntity> {
    const document = this.firebase.db
      .collection(BOT_COMPLETED_DEALS)
      .withConverter(converter)
      .doc(id);
    const documentData = await document.get();

    return new CompletedDealEntity(documentData.data());
  }

  async findAll(): Promise<CompletedDealEntity[]> {
    const allEvents = await this.firebase.db
      .collection(BOT_COMPLETED_DEALS)
      .withConverter(converter)
      .get();

    const events = allEvents.docs.map(
      (doc) => new CompletedDealEntity(doc.data()),
    );

    return events;
  }

  async create(
    dto: CreateCompletedDealDto,
    dealId: string,
    botId: string,
  ): Promise<CompletedDealEntity> {
    const createdAt = new Date().getTime();

    const document = this.firebase.db
      .collection(BOT_COMPLETED_DEALS)
      .doc(dealId);

    const entity: ICompletedDeal = {
      ...dto,
      createdAt,
      id: dealId,
      botId,
    };

    await document.set(entity);

    return entity;
  }
}
