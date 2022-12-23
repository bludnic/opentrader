import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateGridBotEventDto } from 'src/core/db/firestore/repositories/grid-bot-events/dto/create-grid-bot-event.dto';
import { BOT_EVENT_COLLECTION } from 'src/core/db/firestore/utils/collections';
import { GridBotEventEntity } from 'src/core/db/types/entities/grid-bots/events/grid-bot-event.entity';
import { IGridBotEvent } from 'src/core/db/types/entities/grid-bots/events/grid-bot-event.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

const converter: firestore.FirestoreDataConverter<IGridBotEvent> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as GridBotEventEntity,
};

@Injectable()
export class GridBotEventsRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(id: string): Promise<GridBotEventEntity> {
    const document = this.firebase.db
      .collection(BOT_EVENT_COLLECTION)
      .withConverter(converter)
      .doc(id);
    const documentData = await document.get();

    return new GridBotEventEntity(documentData.data());
  }

  async findAll(): Promise<GridBotEventEntity[]> {
    const allEvents = await this.firebase.db
      .collection(BOT_EVENT_COLLECTION)
      .withConverter(converter)
      .get();

    const events = allEvents.docs.map(
      (doc) => new GridBotEventEntity(doc.data()),
    );

    return events;
  }

  async create(
    dto: CreateGridBotEventDto,
    botId: string,
  ): Promise<GridBotEventEntity> {
    const createdAt = new Date().getTime();

    const document = this.firebase.db
      .collection(BOT_EVENT_COLLECTION)
      .doc(dto.id);
    const entity: IGridBotEvent = {
      ...dto,
      createdAt,
      botId,
    };

    await document.set(entity);

    return entity;
  }
}
