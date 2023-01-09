import { Injectable } from '@nestjs/common';
import { firestore } from 'firebase-admin';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';
import { CreateTweetTradingBotDto } from './dto/create-bot/create-tweet-trading-bot.dto';
import { UpdateTweetTradingBotDto } from './dto/update-bot/update-tweet-trading-bot.dto';
import { TweetTradingBotEntity } from './types/tweet-trading-bot/tweet-trading-bot.entity';
import { ITweetTradingBot } from './types/tweet-trading-bot/tweet-trading-bot.interface';
import { TWEET_TRADING_BOTS_COLLECTION } from 'src/experiments/3commas-tweet-smart-trading/db/utils/collections';

const converter: firestore.FirestoreDataConverter<ITweetTradingBot> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as TweetTradingBotEntity,
};

@Injectable()
export class TweetTradingBotsRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(id: string): Promise<TweetTradingBotEntity> {
    const document = this.firebase.db
      .collection(TWEET_TRADING_BOTS_COLLECTION)
      .withConverter(converter)
      .doc(id);
    const documentData = await document.get();

    return new TweetTradingBotEntity(documentData.data());
  }

  async findAll(): Promise<TweetTradingBotEntity[]> {
    const result = await this.firebase.db
      .collection(TWEET_TRADING_BOTS_COLLECTION)
      .withConverter(converter)
      .get();

    const docs = result.docs.map(
      (doc) => new TweetTradingBotEntity(doc.data()),
    );

    return docs;
  }

  async findAllEnabled(): Promise<TweetTradingBotEntity[]> {
    const bots = await this.findAll();
    const enabledBots = bots.filter((bot) => bot.enabled);

    return enabledBots;
  }

  async create(dto: CreateTweetTradingBotDto): Promise<TweetTradingBotEntity> {
    const createdAt = new Date().toISOString();

    const document = this.firebase.db
      .collection(TWEET_TRADING_BOTS_COLLECTION)
      .doc(dto.id);
    const entity: ITweetTradingBot = {
      ...dto,
      createdAt,
    };

    await document.set(entity);

    return entity;
  }

  async update(
    dto: UpdateTweetTradingBotDto,
    botId: string,
  ): Promise<TweetTradingBotEntity> {
    const document = this.firebase.db
      .collection(TWEET_TRADING_BOTS_COLLECTION)
      .doc(botId);

    await document.update(dto);

    const newDocument = await this.firebase.db
      .collection(TWEET_TRADING_BOTS_COLLECTION)
      .withConverter(converter)
      .doc(botId)
      .get();

    return new TweetTradingBotEntity(newDocument.data());
  }

  async updateUsedSignalEvents(
    signalEventsIds: string[],
    bot: TweetTradingBotEntity,
  ): Promise<TweetTradingBotEntity> {
    const { id, ...updateDto } = bot;

    const newDto: UpdateTweetTradingBotDto = {
      ...updateDto,
      usedSignalEventsIds: [...signalEventsIds],
    };

    const savedBot = await this.update(newDto, bot.id);

    return savedBot;
  }
}
