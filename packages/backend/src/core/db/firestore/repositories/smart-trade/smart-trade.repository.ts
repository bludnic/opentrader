import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { firestore } from 'firebase-admin';
import { SMART_TRADE_COLLECTION } from 'src/core/db/firestore/utils/collections';
import { OrderSideEnum } from 'src/core/db/types/common/enums/order-side.enum';
import { OrderStatusEnum } from 'src/core/db/types/common/enums/order-status.enum';
import { SmartBuyOrder, SmartSellOrder } from 'src/core/db/types/entities/smart-trade/orders/types';
import { SmartTradeEntity } from 'src/core/db/types/entities/smart-trade/smart-trade.entity';
import { ISmartTrade } from 'src/core/db/types/entities/smart-trade/smart-trade.interface';
import { FirebaseAdmin, InjectFirebaseAdmin } from 'src/core/firebase';
import { CreateSmartTradeDto } from './dto/create-smart-trade/create-smart-trade.dto';

const converter: firestore.FirestoreDataConverter<ISmartTrade> = {
  toFirestore: (data) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as SmartTradeEntity,
};

@Injectable()
export class SmartTradeRepository {
  constructor(@InjectFirebaseAdmin() private firebase: FirebaseAdmin) {}

  async findOne(smartTradeId: string): Promise<SmartTradeEntity> {
    const document = this.firebase.db
      .collection(SMART_TRADE_COLLECTION)
      .withConverter(converter)
      .doc(smartTradeId);
    const documentData = await document.get();

    const data = documentData.data();
    if (!data) {
      throw new NotFoundException(`Smart Trade with ID: ${smartTradeId} was not found`);
    }

    return new SmartTradeEntity(data);
  }

  async findAll(botId: string, userId: string): Promise<SmartTradeEntity[]> {
    const allSmartTrades = await this.firebase.db
      .collection(SMART_TRADE_COLLECTION)
      .withConverter(converter)
      .where('botId', '==', botId)
      .where('userId', '==', userId)
      .get();

    const smartTrades = allSmartTrades.docs.map(
      (doc) => new SmartTradeEntity(doc.data()),
    );

    return smartTrades;
  }

  async findAllByBotId(botId: string): Promise<SmartTradeEntity[]> {
    const allSmartTrades = await this.firebase.db
      .collection(SMART_TRADE_COLLECTION)
      .withConverter(converter)
      .where('botId', '==', botId)
      .get();

    const smartTrades = allSmartTrades.docs.map(
      (doc) => new SmartTradeEntity(doc.data()),
    );

    return smartTrades;
  }

  async findAllByExchangeAccountId(exchangeAccountId: string): Promise<SmartTradeEntity[]> {
    const allSmartTrades = await this.firebase.db
      .collection(SMART_TRADE_COLLECTION)
      .withConverter(converter)
      .where('exchangeAccountId', '==', exchangeAccountId)
      .get();

    const smartTrades = allSmartTrades.docs.map(
      (doc) => new SmartTradeEntity(doc.data()),
    );

    return smartTrades;
  }

  async findAllByUserId(userId: string): Promise<SmartTradeEntity[]> {
    const allSmartTrades = await this.firebase.db
      .collection(SMART_TRADE_COLLECTION)
      .withConverter(converter)
      .where('userId', '==', userId)
      .get();

    const smartTrades = allSmartTrades.docs.map(
      (doc) => new SmartTradeEntity(doc.data()),
    );

    return smartTrades;
  }

  async create(
    dto: CreateSmartTradeDto,
    userId: string
  ): Promise<SmartTradeEntity> {
    const { id, comment, quantity, buy, sell, baseCurrency, quoteCurrency, exchangeAccountId, botId } = dto;
    const createdAt = new Date().getTime();

    const document = this.firebase.db
      .collection(SMART_TRADE_COLLECTION)
      .doc(dto.id);

    const entity: ISmartTrade = {
      id,
      baseCurrency,
      quoteCurrency,
      comment: comment || '',
      quantity: dto.quantity,
      buyOrder: {
        clientOrderId: buy.clientOrderId || '',
        exchangeOrderId: '',
        price: buy.price,
        quantity,
        status: buy.status || OrderStatusEnum.Idle,
        side: OrderSideEnum.Buy,
        fee: 0,
        createdAt
      },
      sellOrder: {
        clientOrderId: sell.clientOrderId || '',
        exchangeOrderId: '',
        price: sell.price,
        quantity,
        status: sell.status || OrderStatusEnum.Idle,
        side: OrderSideEnum.Sell,
        fee: 0,
        createdAt
      },
      createdAt,
      updatedAt: createdAt,
      botId: botId || null,
      exchangeAccountId,
      userId
    };

    await document.set(entity);

    return entity;
  }

  private async update(smartTrade: ISmartTrade) {
    const document = this.firebase.db
      .collection(SMART_TRADE_COLLECTION)
      .doc(smartTrade.id);

    await document.update(smartTrade);

    return this.findOne(smartTrade.id)
  }

  async updateBuyOrder(
    smartTradeId: string,
    dto: Partial<SmartBuyOrder>,
  ): Promise<SmartTradeEntity> {
    const updatedAt = new Date().getTime();

    const smartTrade = await this.findOne(smartTradeId);

    const newSmartTrade: ISmartTrade = {
      ...smartTrade,
      updatedAt,
      buyOrder: {
        ...smartTrade.buyOrder,
        ...dto,
      }
    }

    return this.update(newSmartTrade);
  }

  async updateSellOrder(
    smartTradeId: string,
    dto: Partial<SmartSellOrder>
  ): Promise<SmartTradeEntity> {
    const updatedAt = new Date().getTime();

    const smartTrade = await this.findOne(smartTradeId);

    if (!smartTrade.sellOrder) {
      throw new ConflictException(
        `[SmartTradeRepository] Can not update the status of the order  
        because this SmartTrade has no sell order (SmartTrade ID: ${smartTradeId})`
      )
    }

    const newSmartTrade: ISmartTrade = {
      ...smartTrade,
      updatedAt,
      sellOrder: {
        ...smartTrade.sellOrder,
        ...dto
      }
    }

    return this.update(newSmartTrade);
  }
}
