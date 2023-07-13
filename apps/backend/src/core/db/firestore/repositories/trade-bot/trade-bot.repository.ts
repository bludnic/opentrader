import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { firestore } from 'firebase-admin';
import { OrderEntity } from "src/core/db/types/entities/trade-bot/orders/order.entity";
import { IOrder } from "src/core/db/types/entities/trade-bot/orders/order.interface";

import { TradeBotEntity } from "src/core/db/types/entities/trade-bot/trade-bot.entity";
import { ITradeBot } from "src/core/db/types/entities/trade-bot/trade-bot.interface";
import { FirebaseAdmin, InjectFirebaseAdmin } from "src/core/firebase";
import { TRADE_BOT_COLLECTION } from "../../utils/collections";
import { CreateTradeBotDto } from "./dto/create-trade-bot.dto";
import { UpdateTradeBotDto } from "./dto/update-trade-bot.dto";

const converter: firestore.FirestoreDataConverter<ITradeBot> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as TradeBotEntity,
};

@Injectable()
export class TradeBotRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(botId: string): Promise<TradeBotEntity> {
    const document = this.firebase.db
      .collection(TRADE_BOT_COLLECTION)
      .withConverter(converter)
      .doc(botId);
    const documentData = await document.get();

    return new TradeBotEntity(documentData.data());
  }

  async findAll(): Promise<TradeBotEntity[]> {
    const allBots = await this.firebase.db
      .collection(TRADE_BOT_COLLECTION)
      .withConverter(converter)
      .get();

    const bots = allBots.docs.map((doc) => new TradeBotEntity(doc.data()));

    return bots;
  }

  async findAllByUserId(userId: string): Promise<TradeBotEntity[]> {
    const allBots = await this.firebase.db
      .collection(TRADE_BOT_COLLECTION)
      .withConverter(converter)
      .where('userId', '==', userId)
      .get();

    const bots = allBots.docs
      .map((doc) => new TradeBotEntity(doc.data()))
      .sort((left, right) => right.createdAt - left.createdAt)
      .sort((left, right) => (right.enabled ? 1 : -1));

    return bots;
  }

  async findAllEnabled(): Promise<TradeBotEntity[]> {
    const enabledBots = await this.firebase.db
      .collection(TRADE_BOT_COLLECTION)
      .withConverter(converter)
      .where('enabled', '==', true)
      .get();

    const bots = enabledBots.docs.map((doc) => new TradeBotEntity(doc.data()));

    return bots;
  }

  async create(dto: CreateTradeBotDto, userId: string): Promise<TradeBotEntity> {
    const createdAt = new Date().getTime();

    const document = this.firebase.db.collection(TRADE_BOT_COLLECTION).doc(dto.id);
    const entity: ITradeBot = {
      ...dto,
      enabled: false,
      orders: {},
      createdAt,
      userId,
    };

    await document.set(entity);

    return entity;
  }

  async update(dto: UpdateTradeBotDto, botId: string): Promise<TradeBotEntity> {
    const document = this.firebase.db.collection(TRADE_BOT_COLLECTION).doc(botId);

    await document.update(dto);

    const newDocument = await this.firebase.db
      .collection(TRADE_BOT_COLLECTION)
      .withConverter(converter)
      .doc('id')
      .get();

    return new TradeBotEntity(newDocument.data());
  }

  async getOrder(orderId: string, botId: string): Promise<OrderEntity> {
    const orders = await this.getOrders(botId);
    const order = orders[orderId];

    if (order) {
      return order;
    } else {
      throw new NotFoundException(`[TradeBotRepository] Order with ID: ${orderId} not found (bot.id: ${botId})`)
    }
  }

  async getOrders(botId: string): Promise<Record<string, OrderEntity>> {
    const bot = await this.findOne(botId);
    
    return bot.orders
  }

  async updateOrders(orders: Record<string, IOrder>, botId: string): Promise<TradeBotEntity> {
    const document = this.firebase.db
      .collection(TRADE_BOT_COLLECTION)
      .withConverter(converter)
      .doc(botId);

    const newBot: Pick<ITradeBot, 'orders'> = {
      orders,
    };

    await document.update({
      orders: newBot.orders,
    });

    const res = await document.get();

    return new TradeBotEntity(res.data());
  }

  async createOrder(orderId: string, order: IOrder, botId: string): Promise<void> {
    const bot = await this.findOne(botId);

    if (bot.orders[orderId]) {
      throw new ConflictException(`[TradeBotRepository] Can create order with ID: ${orderId} because it already exists (bot.id: ${botId})`)
    }    

    const newOrders = {
        ...bot.orders,
        [orderId]: order
    }

    const newBot: UpdateTradeBotDto = {
      ...bot,
      orders: newOrders,
    };

    await this.update(newBot, botId);
  }

  async updateOrder(orderId: string, order: Partial<IOrder>, botId: string): Promise<void> {
    const bot = await this.findOne(botId);

    const targetOrder = bot.orders[orderId];

    if (!targetOrder) {
      throw new NotFoundException(`[TradeBotRepository] Can't update the order with ID: ${orderId} because it doesn't exists (bot.id: ${botId})`)
    }

    const newOrders = {
      ...bot.orders,
      [orderId]: {
        ...targetOrder,
        ...order
      }
    }

    const newBot: UpdateTradeBotDto = {
      ...bot,
      orders: newOrders,
    };

    await this.update(newBot, botId);
  }
}