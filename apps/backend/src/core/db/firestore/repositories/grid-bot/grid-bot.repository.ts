import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateGridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/create-grid-bot.dto';
import { UpdateGridBotDto } from 'src/core/db/firestore/repositories/grid-bot/dto/update-grid-bot.dto';
import { BOT_COLLECTION } from 'src/core/db/firestore/utils/collections';
import { GridBotEntity } from 'src/core/db/types/entities/grid-bots/grid-bot.entity';
import { IGridBot } from 'src/core/db/types/entities/grid-bots/grid-bot.interface';
import { IGridBotSmartTradeRef } from 'src/core/db/types/entities/grid-bots/smart-trades/smart-trade-ref.interface';
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
    const data = documentData.data();

    const normalizedData: IGridBot = {
      ...data,
      gridLines: [...data.gridLines].sort((left, right) => left.price - right.price)
    }

    return new GridBotEntity(normalizedData);
  }

  async findAll(): Promise<GridBotEntity[]> {
    const allBots = await this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .get();

    const bots = allBots.docs.map((doc) => new GridBotEntity(doc.data()));

    return bots;
  }

  async findAllByUserId(userId: string): Promise<GridBotEntity[]> {
    const allBots = await this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .where('userId', '==', userId)
      .get();

    const bots = allBots.docs
      .map((doc) => new GridBotEntity(doc.data()))
      .sort((left, right) => right.createdAt - left.createdAt)
      .sort((left, right) => (right.enabled ? 1 : -1));

    return bots;
  }

  async findAllEnabled(): Promise<GridBotEntity[]> {
    const enabledBots = await this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .where('enabled', '==', true)
      .get();

    const bots = enabledBots.docs.map((doc) => new GridBotEntity(doc.data()));

    return bots;
  }

  async create(dto: CreateGridBotDto, userId: string): Promise<GridBotEntity> {
    const createdAt = new Date().getTime();

    const document = this.firebase.db.collection(BOT_COLLECTION).doc(dto.id);
    const entity: IGridBot = {
      ...dto,
      enabled: false,
      smartTrades: [],
      createdAt,
      userId,
    };

    await document.set(entity);

    return entity;
  }

  async update(dto: UpdateGridBotDto, botId: string): Promise<GridBotEntity> {
    const document = this.firebase.db.collection(BOT_COLLECTION).doc(botId);

    await document.update(dto);

    return this.findOne(botId);
  }

  async updateSmartTradesRefs(smartTradesRefs: IGridBotSmartTradeRef[], botId: string): Promise<GridBotEntity> {
    const document = this.firebase.db
      .collection(BOT_COLLECTION)
      .withConverter(converter)
      .doc(botId);

    const newBot: Pick<IGridBot, 'smartTrades'> = {
      smartTrades: smartTradesRefs,
    };

    await document.update({
      smartTrades: newBot.smartTrades,
    });

    const res = await document.get();

    return new GridBotEntity(res.data());
  }

  async updateSmartTradeRef(smartTradeRef: IGridBotSmartTradeRef, botId: string): Promise<void> {
    const bot = await this.findOne(botId);

    const newSmartTrades = bot.smartTrades.filter((smartTradeRefDb) => {
      return smartTradeRefDb.key !== smartTradeRef.key
    });
    newSmartTrades.push(smartTradeRef)

    const newBot: UpdateGridBotDto = {
      ...bot,
      smartTrades: newSmartTrades,
    };

    await this.update(newBot, botId);
  }
}
