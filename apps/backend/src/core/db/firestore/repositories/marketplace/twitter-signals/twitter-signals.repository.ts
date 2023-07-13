import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { CreateTwitterSignalDto } from './dto/create-twitter-signal.dto';
import { UpdateTwitterSignalDto } from './dto/update-twitter-signal.dto';
import { MARKETPLACE_TWITTER_SIGNALS } from 'src/core/db/firestore/utils/collections';
import { TwitterSignalEntity } from 'src/core/db/types/entities/marketplace/twitter-signals/twitter-signal.entity';
import { ITwitterSignal } from 'src/core/db/types/entities/marketplace/twitter-signals/twitter-signal.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';

const converter: firestore.FirestoreDataConverter<ITwitterSignal> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as TwitterSignalEntity,
};

@Injectable()
export class TwitterSignalsRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(id: string): Promise<TwitterSignalEntity> {
    const document = this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNALS)
      .withConverter(converter)
      .doc(id);
    const documentData = await document.get();

    return new TwitterSignalEntity(documentData.data());
  }

  async findAll(): Promise<TwitterSignalEntity[]> {
    const result = await this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNALS)
      .withConverter(converter)
      .get();

    const docs = result.docs.map((doc) => new TwitterSignalEntity(doc.data()));

    return docs;
  }

  async findAllEnabled(): Promise<TwitterSignalEntity[]> {
    const signals = await this.findAll();
    const enabledSignals = signals.filter((signal) => signal.enabled);

    return enabledSignals;
  }

  async create(dto: CreateTwitterSignalDto): Promise<TwitterSignalEntity> {
    const createdAt = new Date().getTime();

    const document = this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNALS)
      .doc(dto.id);
    const entity: ITwitterSignal = {
      ...dto,
      createdAt,
    };

    await document.set(entity);

    return entity;
  }

  async update(
    dto: UpdateTwitterSignalDto,
    signalId: string,
  ): Promise<TwitterSignalEntity> {
    const document = this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNALS)
      .doc(signalId);

    await document.update(dto);

    const newDocument = await this.firebase.db
      .collection(MARKETPLACE_TWITTER_SIGNALS)
      .withConverter(converter)
      .doc(signalId)
      .get();

    return new TwitterSignalEntity(newDocument.data());
  }
}
