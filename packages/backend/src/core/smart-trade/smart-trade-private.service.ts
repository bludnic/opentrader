import { Inject, Injectable, Logger } from "@nestjs/common";
import { FirestoreService } from "src/core/db/firestore/firestore.service";
import { OrderStatusEnum } from "src/core/db/types/common/enums/order-status.enum";
import { ISmartTrade } from "src/core/db/types/entities/smart-trade/smart-trade.interface";
import { DefaultExchangeServiceFactorySymbol } from "src/core/exchanges/utils/default-exchange.factory";
import { SyncedSmartTradeDto } from "./types/service/sync/synced-smart-trade.dto";
import { IExchangeService } from "../exchanges/types/exchange-service.interface";
import { IPlaceLimitOrderResponse } from "../exchanges/types/exchange/trade/place-limit-order/place-limit-order-response.interface";
import { delay } from 'src/common/helpers/delay';

@Injectable()
export class SmartTradePrivateService {
    constructor(
        @Inject(DefaultExchangeServiceFactorySymbol)
        private exchange: IExchangeService,
        private firestore: FirestoreService,
        private readonly logger: Logger
    ) {}

    async syncSmartTrades(exchangeAccountId: string): Promise<SyncedSmartTradeDto[]> {
        const smartTrades = await this.firestore.smartTrade.findAllByExchangeAccountId(exchangeAccountId);

        this.logger.debug(`[SmartTradeService] Start syncing Smart Trades of the exchange with ID: ${exchangeAccountId}`);

        const syncedSmartTrades = await this.syncSmartTradesStatuses(smartTrades);
        
        this.logger.debug(`[SmartTradeService] End syncing Smart Trades of the exchange with ID: ${exchangeAccountId}`);


        this.logger.debug(`[SmartTradeService] Start processing Smart Trades of the exchange with ID: ${exchangeAccountId}`);

        const placedOrders = await this.processIdleSmartTrades(smartTrades);

        this.logger.debug(`[SmartTradeService] End processing Smart Trades of the exchange with ID: ${exchangeAccountId}`);

        return syncedSmartTrades;
    }

    /**
     * Ищет в БД ордера которые в ожидании и выставляет их на биржу
     * @param smartTrades 
     */
    private async processIdleSmartTrades(smartTrades: ISmartTrade[]): Promise<IPlaceLimitOrderResponse[]> {
        const placedOrders: IPlaceLimitOrderResponse[] = [];

        for (const smartTrade of smartTrades) {
            const placedOrder = await this.processIdleSmartTrade(smartTrade);

            if (placedOrder) {
                placedOrders.push(placedOrder)
            }
      
            await delay(1000);
        }

        return placedOrders
    }

    private async processIdleSmartTrade(smartTrade: ISmartTrade): Promise<IPlaceLimitOrderResponse | void> {
        const {
            buyOrder,
            sellOrder,
            baseCurrency,
            quoteCurrency,
            quantity
        } = smartTrade;

        const tradingPairSymbol = this.exchange.tradingPairSymbol({
            baseCurrency,
            quoteCurrency
        })
 
        if (buyOrder.status === OrderStatusEnum.Idle) {
            const order = await this.exchange.placeLimitOrder({
                side: 'buy',
                price: buyOrder.price,
                quantity,
                symbol: tradingPairSymbol
            });

            await this.firestore.smartTrade.updateBuyOrder(smartTrade.id, {
                status: OrderStatusEnum.Placed,
                exchangeOrderId: order.orderId
            });

            this.logger.debug(`[SmartTradePrivateService] BUY order of the Smart Trade ID: ${smartTrade.id} was placed`)
            console.log('order', order)

            return order;
        } else if (
            sellOrder &&
            sellOrder.status === OrderStatusEnum.Idle &&
            buyOrder.status === 'filled'
        ) {
            const order = await this.exchange.placeLimitOrder({
                side: 'sell',
                price: sellOrder.price,
                quantity,
                symbol: tradingPairSymbol
            });

            await this.firestore.smartTrade.updateSellOrder(smartTrade.id, {
                status: OrderStatusEnum.Placed,
                exchangeOrderId: order.orderId
            });

            this.logger.debug(`[SmartTradePrivateService] SELL order of the Smart Trade ID: ${smartTrade.id} was placed`)
            console.log('order', order)

            return order;
        }
    }

    private async syncSmartTradesStatuses(smartTrades: ISmartTrade[]): Promise<SyncedSmartTradeDto[]> {
        const syncedSmartTrades: SyncedSmartTradeDto[] = [];

        for (const smartTrade of smartTrades) {
            this.logger.log(`[SmartTradeService] Start syncing SmartTrade: #${smartTrade.id}`);

            const syncedSmartTrade = await this.syncSmartTradeStatus(smartTrade);

            if (syncedSmartTrade) {
                syncedSmartTrades.push(syncedSmartTrade);
            }

            this.logger.log(`[SmartTradeService] End syncing SmartTrade: #${smartTrade.id}`);
        }

        return syncedSmartTrades
    }

    /**
     * Cканирует статусы ордеров на бирже,
     * и обновляет статус ордеров SmartTrade'а в БД
     * @param smartTrade 
     */
    private async syncSmartTradeStatus(smartTrade: ISmartTrade): Promise<SyncedSmartTradeDto | void> {
        const {
            buyOrder,
            sellOrder,
            baseCurrency,
            quoteCurrency
        } = smartTrade;

        const tradingPairSymbol = this.exchange.tradingPairSymbol({
            baseCurrency,
            quoteCurrency
        })

        let syncedSmartTrade: SyncedSmartTradeDto | undefined;

        if (buyOrder.status === OrderStatusEnum.Placed) {
            const order = await this.exchange.getLimitOrder({
                exchangeOrderId: buyOrder.exchangeOrderId,
                symbol: tradingPairSymbol,
            });

            // If the buy order was filled then update the status in DB
            if (order.status === 'filled') {
                await this.firestore.smartTrade.updateBuyOrder(smartTrade.id, {
                    status: OrderStatusEnum.Filled
                });

                syncedSmartTrade = {
                    smartTradeId: smartTrade.id,
                    buyOrder: {
                        status: OrderStatusEnum.Filled,
                        price: order.price
                    }
                }

                this.logger.debug(
                    `[SmartTradeService] Buy order was FILLED with the price: ${order.price} ${smartTrade.quoteCurrency}`,
                );
            }
        } else if (sellOrder && sellOrder.status === OrderStatusEnum.Placed) {
            const order = await this.exchange.getLimitOrder({
                exchangeOrderId: sellOrder.exchangeOrderId,
                symbol: tradingPairSymbol,
            });

            // If the sell order was filled then update the status in DB
            if (order.status === 'filled') {
                await this.firestore.smartTrade.updateSellOrder(smartTrade.id, {
                    status: OrderStatusEnum.Filled
                });

                syncedSmartTrade = {
                    smartTradeId: smartTrade.id,
                    sellOrder: {
                        status: OrderStatusEnum.Filled,
                        price: order.price
                    }
                }

                this.logger.debug(
                    `[SmartTradeService] Sell order was FILLED with the price: ${order.price} ${smartTrade.quoteCurrency}`,
                );
            }
        }

        if (syncedSmartTrade) {
            return syncedSmartTrade
        }
    }
}