/**
 * Copyright 2024 bludnic
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Repository URL: https://github.com/bludnic/opentrader
 */
import { ExchangeClosedByUser, NetworkError, RequestTimeout } from "ccxt";
import {
  IAccountAsset,
  ICancelLimitOrderRequest,
  ICancelLimitOrderResponse,
  IGetClosedOrdersRequest,
  IGetClosedOrdersResponse,
  IGetLimitOrderRequest,
  IGetLimitOrderResponse,
  IGetOpenOrdersRequest,
  IGetOpenOrdersResponse,
  IPlaceLimitOrderRequest,
  IPlaceLimitOrderResponse,
  IPlaceStopOrderRequest,
  IPlaceStopOrderResponse,
  IWatchOrdersRequest,
  IWatchOrdersResponse,
  IPlaceMarketOrderRequest,
  ExchangeCode,
  IPlaceMarketOrderResponse,
  OrderSide,
  OrderStatus,
  OrderType,
} from "@opentrader/types";
import { PaperOrder, xprisma } from "@opentrader/db";
import { CCXTExchange } from "./exchange.js";

const ORDER_PLACEMENT_DELAY = 100;
const ORDER_FULFILLMENT_DELAY = 200;

export class PaperExchange extends CCXTExchange {
  /**
   * @override
   */
  public isPaper = true;

  private enabled = true;
  private openOrders: PaperOrder[] = [];
  private resolve = (orders: PaperOrder[]) => {};
  private ordersStatusChanged: Promise<PaperOrder[]> = new Promise((resolve) => (this.resolve = resolve));
  public matchingEnabled = false;

  constructor(exchangeCode: ExchangeCode) {
    super(exchangeCode);
  }

  /**
   * @override
   */
  async destroy() {
    this.enabled = false;
    await this.ccxt.close();
  }

  /**
   * Watch tickers and fill limit orders if the price matched.
   * @internal
   */
  private async match() {
    if (this.matchingEnabled) return;
    this.matchingEnabled = true;

    while (this.enabled && this.symbols.length > 0) {
      try {
        const tickers = await this.ccxt.watchTickers(this.symbols);

        for (const order of this.openOrders) {
          const ticker = tickers[order.symbol];

          if (order.side === "buy" && order.price! >= ticker.ask!) {
            const filledOrder = await xprisma.paperOrder.update({
              where: { id: order.id },
              data: {
                status: "filled" satisfies OrderStatus,
                filledPrice: ticker.ask,
                lastTradeTimestamp: new Date(),
              },
            });
            this.openOrders = this.openOrders.filter((openOrder) => openOrder.id !== order.id); // remove from open orders
            console.log(
              `[${this.exchangeCode} Paper] BUY order ID:${order.id} filled at price ${ticker.ask} ${order.symbol}`,
            );

            this.emitOrder(filledOrder);
          } else if (order.side === "sell" && order.price! <= ticker.bid!) {
            const filledOrder = await xprisma.paperOrder.update({
              where: { id: order.id },
              data: {
                status: "filled" satisfies OrderStatus,
                filledPrice: ticker.bid,
                lastTradeTimestamp: new Date(),
              },
            });
            this.openOrders = this.openOrders.filter((openOrder) => openOrder.id !== order.id); // remove from open orders
            console.log(
              `[${this.exchangeCode} Paper] SELL order ID:${order.id} filled at price ${ticker.bid} ${order.symbol}`,
            );

            this.emitOrder(filledOrder);
          }
        }
      } catch (err) {
        if (err instanceof NetworkError) {
          console.warn(`[PaperExchange ${this.exchangeCode}] NetworkError occurred: ${err.message}. Timeout: 3s`);
          await new Promise((resolve) => setTimeout(resolve, 3000)); // prevents flooding microtasks
        } else if (err instanceof RequestTimeout) {
          console.warn(`[PaperExchange ${this.exchangeCode}] RequestTimeout occurred: ${err.message}`);
        } else if (err instanceof ExchangeClosedByUser) {
          // This is an expected error when destroying ccxt instance via ccxt.close()
          console.info(`[PaperExchange ${this.exchangeCode}] ExchangeClosedByUser`);
          break;
        } else {
          console.error(
            `[PaperExchange ${this.exchangeCode}] ‼️ Unhandled error occurred. Disabling WS connection.`,
            err,
          );
          await this.destroy();
          process.exit(1);
          break;
        }
      }
    }

    this.matchingEnabled = false;
  }

  /**
   * @internal
   */
  emitOrder(order: PaperOrder) {
    this.resolve([order]);
    this.ordersStatusChanged = new Promise((resolve) => (this.resolve = resolve));
  }

  /**
   * @internal
   */
  private async pullOpenOrders() {
    this.openOrders = await xprisma.paperOrder.findMany({
      where: {
        type: "Limit" satisfies OrderType,
        status: {
          in: ["open", "partially_filled"] satisfies OrderStatus[],
        },
      },
    });
  }

  /**
   * @internal
   */
  private get symbols() {
    return [...new Set(this.openOrders.map((order) => order.symbol))];
  }

  /**
   * @override
   */
  async accountAssets(): Promise<IAccountAsset[]> {
    const data = await xprisma.paperAsset.findMany();

    return data.map((asset) => ({
      currency: asset.currency,
      balance: asset.balance,
      availableBalance: asset.balance, // @todo available balance
    }));
  }

  /**
   * @override
   */
  async getLimitOrder(params: IGetLimitOrderRequest): Promise<IGetLimitOrderResponse> {
    const order = await xprisma.paperOrder.findUniqueOrThrow({
      where: { id: Number(params.orderId) },
    });

    return {
      ...order,
      price: order.price!,
      side: order.side as OrderSide,
      status: order.status as OrderStatus,
      createdAt: order.createdAt.getTime(),
      lastTradeTimestamp: order.lastTradeTimestamp.getTime(),
      exchangeOrderId: `${order.id}`,
    };
  }

  /**
   * @override
   */
  async placeLimitOrder(params: IPlaceLimitOrderRequest): Promise<IPlaceLimitOrderResponse> {
    if ("clientOrderId" in params) {
      throw new Error("Fetch limit order by `clientOrderId` is not supported yet");
    }

    const order = await xprisma.paperOrder.create({
      data: {
        type: "Limit" satisfies OrderType,
        symbol: params.symbol,
        side: params.side,
        quantity: params.quantity,
        price: params.price,
      },
    });
    await this.pullOpenOrders();

    // simulate order execution by delaying it
    setTimeout(() => {
      this.emitOrder(order);
      void this.match();
    }, ORDER_PLACEMENT_DELAY);

    return {
      orderId: `${order.id}`,
    };
  }

  /**
   * @override
   */
  async placeMarketOrder(params: IPlaceMarketOrderRequest): Promise<IPlaceMarketOrderResponse> {
    const order = await xprisma.paperOrder.create({
      data: {
        type: "Market" satisfies OrderType,
        symbol: params.symbol,
        side: params.side,
        quantity: params.quantity,
      },
    });

    const ticker = await this.ccxt.fetchTicker(params.symbol);
    const filledOrder = await xprisma.paperOrder.update({
      where: { id: order.id },
      data: {
        status: "filled" satisfies OrderStatus,
        filledPrice: params.side === "buy" ? ticker.ask : ticker.bid,
        lastTradeTimestamp: new Date(),
      },
    });

    setTimeout(() => {
      this.emitOrder(order);
    }, ORDER_PLACEMENT_DELAY);

    setTimeout(() => {
      this.emitOrder(filledOrder);
    }, ORDER_FULFILLMENT_DELAY);

    return {
      orderId: `${filledOrder.id}`,
    };
  }

  /**
   * @override
   */
  async placeStopOrder(params: IPlaceStopOrderRequest): Promise<IPlaceStopOrderResponse> {
    throw new Error("Stop order is not supported in Paper Trading");
  }

  /**
   * @override
   */
  async getOpenOrders(params: IGetOpenOrdersRequest): Promise<IGetOpenOrdersResponse> {
    const orders = await xprisma.paperOrder.findMany({
      where: {
        symbol: params.symbol,
        status: {
          in: ["open", "partially_filled"] satisfies OrderStatus[],
        },
      },
    });

    return orders.map((order) => ({
      ...order,
      price: order.price!,
      side: order.side as OrderSide,
      status: order.status as Extract<OrderSide, "open">, // @todo open | partially_filled
      createdAt: order.createdAt.getTime(),
      lastTradeTimestamp: order.lastTradeTimestamp.getTime(),
      exchangeOrderId: `${order.id}`,
      filledPrice: null,
    }));
  }

  /**
   * @override
   */
  async getClosedOrders(params: IGetClosedOrdersRequest): Promise<IGetClosedOrdersResponse> {
    const orders = await xprisma.paperOrder.findMany({
      where: {
        symbol: params.symbol,
        status: {
          in: ["filled", "canceled"] satisfies OrderStatus[],
        },
      },
    });

    return orders.map((order) => ({
      ...order,
      price: order.price!,
      side: order.side as OrderSide,
      status: order.status as Extract<OrderStatus, "filled" | "canceled">,
      createdAt: order.createdAt.getTime(),
      lastTradeTimestamp: order.lastTradeTimestamp.getTime(),
      exchangeOrderId: `${order.id}`,
      filledPrice: order.filledPrice!,
    }));
  }

  /**
   * @override
   */
  async cancelLimitOrder(params: ICancelLimitOrderRequest): Promise<ICancelLimitOrderResponse> {
    const order = await xprisma.paperOrder.update({
      where: { id: Number(params.orderId) },
      data: {
        status: "canceled" satisfies OrderStatus,
      },
    });
    this.emitOrder(order);

    return {
      orderId: params.orderId,
    };
  }

  /**
   * @override
   */
  async watchOrders(params: IWatchOrdersRequest = {}): Promise<IWatchOrdersResponse> {
    const orders = await this.ordersStatusChanged;

    return orders.map((order) => ({
      ...order,
      price: order.price!,
      side: order.side as OrderSide,
      status: order.status as OrderStatus,
      createdAt: order.createdAt.getTime(),
      lastTradeTimestamp: order.lastTradeTimestamp.getTime(),
      exchangeOrderId: `${order.id}`,
      filledPrice: order.filledPrice!,
    }));
  }
}
