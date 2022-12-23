import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateGridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/create-grid-bot.dto';
import { UpdateGridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/update-grid-bot.dto';
import { BOT_COLLECTION } from 'src/core/db/firestore/utils/collections';
import { IDeal } from 'src/core/db/types/entities/grid-bots/deals/types';
import { GridBotEntity } from 'src/core/db/types/entities/grid-bots/grid-bot.entity';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

const converter: firestore.FirestoreDataConverter<IGridBot> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as GridBotEntity,
};

@Injectable()
export class GridBotRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(id: string): Promise<GridBotEntity> {
    const document = this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .doc(id);
    const documentData = await document.get();

    return new GridBotEntity(documentData.data());
  }

  async findAll(): Promise<GridBotEntity[]> {
    const allBots = await this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .get();

    const bots = allBots.docs.map((doc) => new GridBotEntity(doc.data()));

    return bots;
  }

  async create(dto: CreateGridBotDto, userId: string): Promise<GridBotEntity> {
    const createdAt = new Date().getTime();

    const document = this.firebase.db.collection(BOT_COLLECTION).doc(dto.id);
    const entity: IGridBot = {
      ...dto,
      enabled: false,
      deals: [],
      createdAt,
      userId,
    };

    await document.set(entity);

    return entity;
  }

  async update(dto: UpdateGridBotDto, botId: string): Promise<GridBotEntity> {
    const document = this.firebase.db.collection(BOT_COLLECTION).doc(botId);

    await document.update(dto);

    const newDocument = await this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .doc('id')
      .get();

    return new GridBotEntity(newDocument.data());
  }

  async updateDeals(deals: IDeal[], botId: string): Promise<GridBotEntity> {
    const document = this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .doc(botId);

    const newBot: Pick<IGridBot, 'deals'> = {
      deals,
    };

    await document.update({
      deals: newBot.deals,
    });

    const res = await document.get();

    return new GridBotEntity(res.data());
  }

  async updateDeal(orderId: string, botId: string, deal: IDeal): Promise<void> {
    const bot = await this.findOne(botId);

    const newDeals = bot.deals.map((dealDb) => {
      if (dealDb.id === deal.id) {
        return deal;
      }

      return dealDb;
    });

    const newBot: UpdateGridBotDto = {
      ...bot,
      deals: newDeals,
    };

    await this.update(newBot, botId);
  }
}
