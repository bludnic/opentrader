import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateTwitterSignalEventDto } from './dto/create-twitter-signal-event.dto';
import { UpdateTwitterSignalEventDto } from './dto/update-twitter-signal-event.dto';
import { MARKETPLACE_TWITTER_SIGNAL_EVENTS } from 'src/core/db/firestore/utils/collections';
import { TwitterSignalEventEntity } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/twitter-signal-event.entity';
import { ITwitterSignalEvent } from 'src/core/db/types/entities/marketplace/twitter-signals/signal-events/twitter-signal-event.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

const converter: firestore.FirestoreDataConverter<ITwitterSignalEvent> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as TwitterSignalEventEntity,
};

@Injectable()
export class TwitterSignalEventsRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(id: string): Promise<TwitterSignalEventEntity> {
    const document = this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNAL_EVENTS)
      .withConverter(converter)
      .doc(id);
    const documentData = await document.get();

    return new TwitterSignalEventEntity(documentData.data());
  }

  async findAll(): Promise<TwitterSignalEventEntity[]> {
    const result = await this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNAL_EVENTS)
      .withConverter(converter)
      .get();

    const docs = result.docs.map(
      (doc) => new TwitterSignalEventEntity(doc.data()),
    );

    return docs;
  }

  async findBySignalId(signalId: string): Promise<TwitterSignalEventEntity[]> {
    const result = await this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNAL_EVENTS)
      .withConverter(converter)
      .get();

    const docs = result.docs.map(
      (doc) => new TwitterSignalEventEntity(doc.data()),
    );

    return docs.filter((doc) => doc.signalId === signalId);
  }

  async create(
    dto: CreateTwitterSignalEventDto,
  ): Promise<TwitterSignalEventEntity> {
    const parsedAt = new Date().toISOString();

    const document = this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNAL_EVENTS)
      .doc(dto.id);
    const entity: ITwitterSignalEvent = {
      ...dto,
      parsedAt,
    };

    await document.set(entity);

    return entity;
  }

  async createIfNotExists(
    dto: CreateTwitterSignalEventDto,
  ): Promise<{ signalEvent: TwitterSignalEventEntity, isNew: boolean }> {
    // Check if signal already exists
    // If yes, do nothing
    const signalEventDb = await this.findOne(dto.id);
    const signalAlreadyExists = !!(signalEventDb && signalEventDb.signalId);
    if (signalAlreadyExists) {
      return {
        signalEvent: signalEventDb,
        isNew: false
      }
    }

    const parsedAt = new Date().toISOString();

    const document = this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNAL_EVENTS)
      .doc(dto.id);
    const entity: ITwitterSignalEvent = {
      ...dto,
      parsedAt,
    };

    await document.set(entity);

    return {
      signalEvent: entity,
      isNew: true
    };
  }

  async update(
    dto: UpdateTwitterSignalEventDto,
    signalId: string,
  ): Promise<TwitterSignalEventEntity> {
    const document = this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNAL_EVENTS)
      .doc(signalId);

    await document.update(dto);

    const newDocument = await this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNAL_EVENTS)
      .withConverter(converter)
      .doc(signalId)
      .get();

    return new TwitterSignalEventEntity(newDocument.data());
  }
}
