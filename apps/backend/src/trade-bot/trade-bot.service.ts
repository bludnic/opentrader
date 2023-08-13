import { IExchange } from '@bifrost/exchanges';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { CreateTradeBotDto } from 'src/core/db/firestore/repositories/trade-bot/dto/create-trade-bot.dto';
import { TradeBotDto } from 'src/core/db/firestore/repositories/trade-bot/dto/trade-bot.dto';
import { OrderStatusEnum } from 'src/core/db/types/entities/trade-bot/orders/enums/order-status.enum';
import { IOrder } from 'src/core/db/types/entities/trade-bot/orders/order.interface';
import { ITradeBot } from 'src/core/db/types/entities/trade-bot/trade-bot.interface';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { simpleGrid } from './bot-templates/simple-grid';
import { CreateTradeBotRequestBodyDto } from './dto/create-bot/create-trade-bot-request-body.dto';
import { TradeBotOrdersService } from './trade-bot-orders.service';
import { IBotTemplate } from './types/BotTemplate';
import { calcOkxSymbol } from './utils/calcOkxSymbol';
import { checkOrderFilled } from './utils/orders/checkOrderFilled';

export class TradeBotService {
  private botTemplate: IBotTemplate;

  constructor(
    private exchange: IExchange,
    private firestore: FirestoreService,
    private readonly logger: Logger,
  ) {
    this.botTemplate = simpleGrid; // @todo hardcoded
  }

  async getBot(botId: string): Promise<TradeBotDto> {
    this.logger.debug(`[TradeBot] getBot with ID ${botId}`);
    const bot = await this.firestore.tradeBot.findOne(botId);

    return bot;
  }

  async getBots(): Promise<TradeBotDto[]> {
    const bots = await this.firestore.tradeBot.findAll();

    return bots.sort((left, right) => left.createdAt - right.createdAt);
  }

  async createBot(dto: CreateTradeBotRequestBodyDto, user: IUser) {
    const botEntity: CreateTradeBotDto = {
      ...dto,
    };
    const bot = await this.firestore.tradeBot.create(botEntity, user.uid);

    this.logger.debug(
      `[TradeBot] The bot ${bot.id} with pair ${bot.baseCurrency}/${bot.quoteCurrency} was created succesfully`,
    );

    return bot;
  }

  async startBot(botId: string) {
    const bot = await this.firestore.tradeBot.findOne(botId);

    if (!bot) {
      throw new NotFoundException(`Bot with "${botId}" not found`);
    }

    // if (Object.values(bot.orders).length > 0) {
    //   throw new ConflictException(
    //     `Bot already has opened deals. Need to fix @todo`,
    //   );
    // }

    await this.firestore.tradeBot.update(
      {
        enabled: true,
      },
      botId,
    );
    this.logger.debug('Bot has been enabled');

    const updatedBot = await this.getBot(botId);

    // Call the `onStart` HOOK event
    const onStartHook = this.botTemplate.onStart({
      logger: this.logger,
      bot: updatedBot,
      ordersService: new TradeBotOrdersService(
        bot,
        this.exchange,
        this.firestore,
        this.logger,
      ),
    });
    if (onStartHook instanceof Promise) {
      await onStartHook;
    }

    return {
      bot: updatedBot,
    };
  }

  async stopBot(botId: string) {
    const bot = await this.firestore.tradeBot.findOne(botId);

    const updatedBot = await this.firestore.tradeBot.update(
      {
        enabled: false,
      },
      botId,
    );

    this.logger.debug(`[TradeBot] Bot has been stopped`);

    // Call the `onStop` HOOK event
    const onStopHook = this.botTemplate.onStop({
      logger: this.logger,
      bot: updatedBot,
      ordersService: new TradeBotOrdersService(
        bot,
        this.exchange,
        this.firestore,
        this.logger,
      ),
    });
    if (onStopHook instanceof Promise) {
      await onStopHook;
    }
  }

  /**
   * Проверяем статус лимит ордеров на бирже.
   * Если ордер заполнен то обновляем статус в БД.
   *
   * @param bot
   */
  async syncOrders(bot: ITradeBot): Promise<string[]> {
    const syncedOrdersIds: string[] = [];

    const orders = Object.values(bot.orders);

    for (const order of orders) {
      const updated = await this.syncOrderStatus(order, bot);

      if (updated) {
        syncedOrdersIds.push(order.clientOrderId);
      }
    }

    this.logger.debug(
      `[TradeBotService] Number of synced orders: ${syncedOrdersIds.length}`,
      syncedOrdersIds,
    );

    return syncedOrdersIds;
  }

  /**
   * Returns the order ID if the status was changed.
   * If nothing changed the promise will return void.
   * @param order
   * @param bot
   */
  private async syncOrderStatus(
    order: IOrder,
    bot: ITradeBot,
  ): Promise<{ updated: boolean }> {
    this.logger.debug(`[TradeBotService] syncOrder with ID: ${order.orderId}`);

    const exchangeOrder = await this.exchange.getLimitOrder({
      symbol: calcOkxSymbol(bot.baseCurrency, bot.quoteCurrency),
      orderId: order.orderId,
    });

    if (checkOrderFilled(exchangeOrder)) {
      await this.firestore.tradeBot.updateOrder(
        order.clientOrderId,
        {
          status: OrderStatusEnum.Filled,
        },
        bot.id,
      );

      this.logger.debug(
        `[TradeBotService] Order "${order.clientOrderId}" was updated to status Filled`,
      );

      return {
        updated: true,
      };
    } else {
      this.logger.debug(
        `[TradingBotService] Order "${order.clientOrderId}" status didn't change. Nothing to update.`,
      );

      return {
        updated: false,
      };
    }
  }
}
