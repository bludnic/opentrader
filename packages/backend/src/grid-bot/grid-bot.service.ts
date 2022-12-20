import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import big from 'big.js';
import { IBotFirestore } from 'src/core/db/firestore/collections/bots/bot-firestore.interface';
import {
  DealBuyFilled,
  DealSellFilled,
  DealStatusEnum,
  IDeal,
  OrderStatusEnum,
} from 'src/core/db/firestore/collections/bots/types/deal-firestore.interface';
import { FirestoreService } from 'src/core/db/firestore/firestore.service';
import { ICreateBotParams } from 'src/core/db/firestore/types/grid-bots/create-bot/create-bot-params.interface';
import { IAccountAsset } from 'src/core/exchanges/types/exchange/account/account-asset/account-asset.interface';
import { IPlaceLimitOrderRequest } from 'src/core/exchanges/types/exchange/trade/place-limit-order/place-limit-order-request.interface';
import { IExchangeService } from 'src/core/exchanges/types/exchange-service.interface';
import { DefaultExchangeServiceFactorySymbol } from 'src/core/exchanges/utils/default-exchange.factory';

import { SyncBotResponseBodyDto } from 'src/grid-bot/dto/sync-bot/sync-bot-response-body.dto';
import { MissingCurrencyOnExchangeException } from 'src/grid-bot/exceptions/missing-currency-on-exchange.exception';
import { NotEnoughFundsException } from 'src/grid-bot/exceptions/not-enough-funds.exception';
import { IGridBotSettings } from 'src/grid-bot/types/grid-bot-settings.interface';
import { SyncedDealDto } from 'src/grid-bot/types/service/sync/synced-deal.dto';
import { calculateInvestment } from 'src/grid-bot/utils/calculateInvestment';
import { calculateLimitOrdersFromDeals } from 'src/grid-bot/utils/calculateLimitOrdersFromDeals';
import { calcInitialDealsByAssetPrice } from 'src/grid-bot/utils/deals/calcInitialDealsByAssetPrice';
import { mapLimitOrdersToPlacedDeals } from 'src/grid-bot/utils/dto/mapLimitOrdersToPlacedDeals';
import { checkOrderFilled } from 'src/grid-bot/utils/orders/checkOrderFilled';
import { recalculateDeals } from 'src/grid-bot/utils/recalculateDeals';
import { recalculateDealsDiff } from 'src/grid-bot/utils/recalculateDealsDiff';

@Injectable({
  scope: Scope.REQUEST,
})
export class GridBotService {
  private readonly logger = new Logger(GridBotService.name);

  constructor(
    @Inject(DefaultExchangeServiceFactorySymbol)
    private exchange: IExchangeService,
    private firestore: FirestoreService,
  ) {}

  async getBot(botId: string) {
    const bot = await this.firestore.getBot({ id: botId });
    this.logger.debug(`getBot with ID ${bot.id}`);

    return bot;
  }

  async createBot(params: IGridBotSettings) {
    const createBotParams: ICreateBotParams = {
      ...params,
      enabled: false,
    };
    const bot = await this.firestore.createBot(createBotParams);

    this.logger.debug(
      `The bot ${bot.id} with pair ${bot.baseCurrency}/${bot.quoteCurrency} was created succesfully`,
      {
        gridLevels: bot.gridLevels,
        quantityPerGrid: bot.quantityPerGrid,
        highPrice: bot.highPrice,
        lowPrice: bot.lowPrice,
      },
    );

    return bot;
  }

  async startBot(botId: string) {
    const bot = await this.firestore.getBot({ id: botId });

    if (!bot) {
      throw new NotFoundException(`Bot with "${botId}" not found`);
    }

    if (bot.deals.length > 0) {
      throw new ConflictException(
        `Bot already has opened deals. Need to fix @todo`,
      );
    }

    const currentAssetPrice = await this.getCurrentAssetPrice(
      bot.baseCurrency,
      bot.quoteCurrency,
    );
    this.logger.debug(
      `Current ${bot.baseCurrency} asset price is ${currentAssetPrice} ${bot.quoteCurrency}`,
    );

    const initialDeals = calcInitialDealsByAssetPrice(bot, currentAssetPrice);
    this.logger.debug(
      `Calculate initial deals (total: ${initialDeals.length})`,
      {
        deals: initialDeals.map((deal) => ({
          id: deal.id,
          buyPrice: deal.buyOrder.price,
          sellPrice: deal.sellOrder.price,
          status: deal.status,
        })),
      },
    );

    // Check enough funds to start the Bot
    this.logger.debug(`Check enough funds to start Bot`);
    await this.checkEnoughFundsToStartBot(bot, initialDeals);

    const limitOrders = calculateLimitOrdersFromDeals(initialDeals, bot);
    this.logger.debug(
      `Prepare limit orders to be placed (total: ${limitOrders.length})`,
      {
        limitOrders: limitOrders.map((limitOrder) => ({
          clientOrderId: limitOrder.clientOrderId,
          price: limitOrder.price,
        })),
      },
    );

    const placedLimitOrders = await this.placeOrders(limitOrders);
    this.logger.debug(
      `Limit orders placed successfully (total: ${placedLimitOrders.length})`,
      {
        placedLimitOrders: placedLimitOrders.map((order) => ({
          orderId: order.orderId,
          clientOrderId: order.clientOrderId,
        })),
      },
    );

    placedLimitOrders.forEach((limitOrder) => {
      if (!limitOrder.orderId) {
        this.logger.error(
          `Order is missing "orderId" field. Possible reason: Order with "clientOrderId: ${limitOrder.clientOrderId}" already exists on the exchange`,
          limitOrder,
        );
      }
    });

    await this.firestore.updateDeals(botId, initialDeals);
    this.logger.debug(`All ${initialDeals.length} initial deals saved to DB`);

    await this.firestore.updateBot({
      id: botId,
      enabled: true,
    });
    this.logger.debug('Bot has been enabled');

    return this.getBot(botId);
  }

  async stopBot(botId: string) {
    const bot = await this.firestore.getBot({ id: botId });

    if (bot.deals.length === 0) {
      throw new ConflictException(
        'Bot does not have open orders. Nothing to stop.',
      );
    }

    await this.stopAllOrders(bot);

    await this.firestore.updateDeals(botId, []);

    await this.firestore.updateBot({
      id: botId,
      enabled: false,
    });
  }

  private async placeOrders(placeOrders: IPlaceLimitOrderRequest[]) {
    const promises = placeOrders.map((placeOrder, i) => {
      return this.exchange.placeLimitOrder(placeOrder);
    });

    return Promise.all(promises);
  }

  private async stopAllOrders(bot: IBotFirestore) {
    for (const deal of bot.deals) {
      // `too many requests` если отправлять запросы с меньшим интервалом
      // нужно прикрутить батчинг для отмены ордеров пачкой

      if (deal.buyOrder) {
        await this.exchange.cancelLimitOrder({
          clientOrderId: deal.buyOrder.id,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });
        this.logger.debug(`Buy order with ${deal.buyOrder.id} was cancelled`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (deal.sellOrder) {
        await this.exchange.cancelLimitOrder({
          clientOrderId: deal.sellOrder.id,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });
        this.logger.debug(`Sell order with ${deal.sellOrder.id} was cancelled`);

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  public async getCurrentAssetPrice(
    baseCurrency: string,
    quoteCurrency: string,
  ): Promise<number> {
    const asset = await this.exchange.getMarketPrice({
      symbol: `${baseCurrency}-${quoteCurrency}`,
    });

    return asset.price;
  }

  /**
   * Синхронизация делится на два этапа:
   *
   * 1. Синхронизация статуса заполненных ордеров на бирже -> БД
   * 2. Перерасчет ордеров которые нужно выставить на биржу
   * 2.a. Выставление Limit ордеров на биржу
   * 2.b. Сохранение нового списка Deals в БД
   *
   * @param botId
   */
  async syncMarketOrders(botId: string): Promise<SyncBotResponseBodyDto> {
    let bot = await this.firestore.getBot({ id: botId });

    if (!bot.enabled) {
      throw new ConflictException('Bot not started. Start the bot first.');
    }

    this.logger.debug(`Start syncing bot ${bot.id}`);

    const currentAssetPrice = await this.getCurrentAssetPrice(
      bot.baseCurrency,
      bot.quoteCurrency,
    );
    this.logger.debug(
      `Current ${bot.baseCurrency} asset price is ${currentAssetPrice} ${bot.quoteCurrency}`,
    );

    // Sync filled statuses of the limits orders with Deals
    this.logger.debug('Start syncing limit orders filled status with DB');
    const syncedDeals = await this.syncFilledStatus(bot);

    bot = await this.getBot(botId); // get actual deals after sync

    // Recalculate deals after updating filled status
    const newDeals = recalculateDeals(bot.deals);
    const newDealsDiff = recalculateDealsDiff(bot.deals);
    this.logger.debug('Recalculate new deals diff', {
      newDealsDiff,
    });

    const limitOrders = calculateLimitOrdersFromDeals(newDealsDiff, bot);

    // Maybe it's to much information for logging in the `IPlaceLimitOrderRequest` type.
    //
    // Would be better to simplify this interface into something like `type SimpleDeal`,
    // which contains `price` and `side` properties only.
    this.logger.debug('Calculate limit orders from dealsDiff', {
      limitOrders,
    });

    this.logger.debug(`Placing limit orders (total: ${limitOrders.length})...`);

    // Вангую тут проблему.
    // Если один из запросов `placeOrder` упадет -- в БД ничего не запишется.
    // В итоге на бирже некоторые ордера будут созданы но в базе их не будет.
    // Получится разсинхрон.
    //
    // Возможное решение:
    // 1. Ставить по одному placeOrder
    // 2. При успешном ответе сохранять в базу
    // 3. При неуспешном ответе, ордер на бирже не создастся, и в БД соответственно
    // тоже не запишется. Это обеспечит "атомарность" операции.
    const exchangeOrders = await this.placeOrders(limitOrders);
    this.logger.debug(
      `Limit orders placed successfully (total: ${exchangeOrders.length})`,
    );

    await this.firestore.updateDeals(botId, newDeals);
    this.logger.debug('Deals updated');

    return {
      message: 'Deals synced successfully',
      currentAssetPrice,
      filledOrders: syncedDeals,
      placedOrders: mapLimitOrdersToPlacedDeals(limitOrders),
    };
  }

  /**
   * Проверяем статус лимит ордеров на бирже.
   * Если ордер заполнен то обновляем статус в БД.
   *
   * @param bot
   */
  async syncFilledStatus(bot: IBotFirestore): Promise<SyncedDealDto[]> {
    const syncedDeals: SyncedDealDto[] = [];

    for (const deal of bot.deals) {
      this.logger.log(`Start syncing deal: #${deal.id}`);

      if (deal.status === DealStatusEnum.Idle) {
        // Order not placed yet, nothing to do.
        //
        // This scenario shouldn't happen, because after
        // the bot is started such status should not exist.
      } else if (deal.status === DealStatusEnum.BuyPlaced) {
        const limitBuyOrder = await this.exchange.getLimitOrder({
          clientOrderId: deal.buyOrder.id,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });

        if (checkOrderFilled(limitBuyOrder)) {
          const newDeal: DealBuyFilled = {
            ...deal,
            id: deal.id,
            buyOrder: {
              ...deal.buyOrder,
              status: OrderStatusEnum.Filled,
            },
            status: DealStatusEnum.BuyFilled,
          };

          await this.firestore.updateDeal(deal.id, bot.id, newDeal);
          this.logger.debug(
            `[BUY] Limit order was FILLED with price: ${limitBuyOrder.price} ${bot.quoteCurrency}`,
          );

          syncedDeals.push({
            dealId: deal.id,
            buyOrder: {
              price: deal.buyOrder.price,
              status: OrderStatusEnum.Filled,
              current: false,
            },
          });
        } else {
          this.logger.debug(
            `[BUY] Limit order with price: ${limitBuyOrder.price} ${bot.quoteCurrency} is not filled yet`,
          );
        }
      } else if (deal.status === DealStatusEnum.BuyFilled) {
        // order status was already synced, nothing to do
      } else if (deal.status === DealStatusEnum.SellPlaced) {
        const limitSellOrder = await this.exchange.getLimitOrder({
          clientOrderId: deal.sellOrder.id,
          symbol: `${bot.baseCurrency}-${bot.quoteCurrency}`,
        });

        if (checkOrderFilled(limitSellOrder)) {
          const newDeal: DealSellFilled = {
            ...deal,
            sellOrder: {
              ...deal.sellOrder,
              status: OrderStatusEnum.Filled,
            },
            status: DealStatusEnum.SellFilled,
          };

          await this.firestore.updateDeal(deal.id, bot.id, newDeal);
          this.logger.debug(
            `[SELL] Limit order was FILLED with price: ${limitSellOrder.price} ${bot.quoteCurrency}`,
          );
          syncedDeals.push({
            dealId: deal.id,
            sellOrder: {
              price: deal.sellOrder.price,
              status: OrderStatusEnum.Filled,
              current: false,
            },
          });
        } else {
          this.logger.debug(
            `[SELL] Limit order with price: ${limitSellOrder.price} ${bot.quoteCurrency} is not filled yet`,
          );
        }
      } else if (deal.status === DealStatusEnum.SellFilled) {
        // order status was already synced, nothing to do
      }
    }

    return syncedDeals;
  }

  public async checkEnoughFundsToStartBot(
    bot: IBotFirestore,
    deals: IDeal[],
  ): Promise<void> {
    const {
      baseCurrencyAmount: baseCurrencyAmountRequired,
      quoteCurrencyAmount: quoteCurrencyAmountRequired,
    } = calculateInvestment(deals, bot.quantityPerGrid);
    const assets = await this.exchange.accountAssets();

    // check Base currency amount
    await this.checkEnoughBalance(
      bot.baseCurrency,
      baseCurrencyAmountRequired,
      assets,
    );

    // check Quote currency amount
    await this.checkEnoughBalance(
      bot.quoteCurrency,
      quoteCurrencyAmountRequired,
      assets,
    );
  }

  private async checkEnoughBalance(
    currencySymbol: string,
    requiredAmount: number,
    assets: IAccountAsset[],
  ): Promise<void> {
    const currencyAsset = assets.find(
      (asset) => asset.currency === currencySymbol,
    );

    if (!currencyAsset) {
      const errorMessage = `Missing currency asset ${currencyAsset} on the exchange`;

      this.logger.debug(`[checkEnoughBalance] ${errorMessage}`);
      throw new MissingCurrencyOnExchangeException(errorMessage);
    }

    // availableBalance < requiredAmount
    if (big(currencyAsset.availableBalance).lt(requiredAmount)) {
      const errorMessage =
        `Not enough ${currencySymbol} funds to start the Bot. ` +
        `Balance: ${currencyAsset.balance}; ` +
        `Available Balance: ${currencyAsset.availableBalance}; ` +
        `Required Amount: ${requiredAmount}`;

      this.logger.debug(`[checkEnoughBalance]: ${errorMessage}`);
      throw new NotEnoughFundsException(errorMessage);
    }

    this.logger.debug(
      `[checkEnoughBalance]: Enough ${currencySymbol}. ` +
        `Balance: ${currencyAsset.balance}; ` +
        `Available Balance: ${currencyAsset.availableBalance}; ` +
        `Required Amount: ${requiredAmount}`,
    );
  }
}
