import { exchanges, IExchange } from "@opentrader/exchanges";
import { ExchangeCode, IPlaceLimitOrderResponse } from "@opentrader/types";
import { OrderNotFound } from "ccxt";
import {
  SmartTradeWithOrders,
  ExchangeAccountWithCredentials,
  SmartTradeEntity,
  toSmartTradeEntity,
  xprisma,
  OrderEntity,
  Prisma,
} from "@opentrader/db";

export class SmartTradeRepository {
  private exchange: IExchange;
  private smartTrade: SmartTradeEntity;

  constructor(
    smartTradeModel: SmartTradeWithOrders,
    private exchangeAccount: ExchangeAccountWithCredentials,
  ) {
    this.smartTrade = toSmartTradeEntity(smartTradeModel);

    const credentials = {
      ...exchangeAccount.credentials,
      code: exchangeAccount.credentials.code as ExchangeCode, // workaround for casting string literal into `ExchangeCode`
      password: exchangeAccount.password || "",
    };

    this.exchange = exchanges[exchangeAccount.exchangeCode](credentials);
  }

  async placeOrders() {
    if (this.smartTrade.entryType === "Ladder") {
      throw new Error("Unimplemented `entryType = Ladder`");
    }
    if (this.smartTrade.takeProfitType === "Ladder") {
      throw new Error("Unimplemented `takeProfitType = Ladder`");
    }

    const { entryOrder, takeProfitOrder } = this.smartTrade;

    const orderPendingPlacement =
      entryOrder.status === "Idle"
        ? entryOrder
        : entryOrder.status === "Filled" && takeProfitOrder.status === "Idle"
        ? takeProfitOrder
        : null;

    if (orderPendingPlacement) {
      const placedOrder = await this.placeOrder(orderPendingPlacement);
      console.log("ST->placedOrder", placedOrder);

      // Update status to Placed
      // Save exchange orderId to DB
      await xprisma.order.update({
        where: {
          id: orderPendingPlacement.id,
        },
        data: {
          status: "Placed",
          exchangeOrderId: placedOrder.orderId,
          placedAt: new Date(), // maybe use Exchange time (if possible)
        },
      });
    }
  }

  async placeOrder(order: OrderEntity): Promise<IPlaceLimitOrderResponse> {
    if (order.type === "Market") {
      throw new Error("placeOrder: Market order is not supported yet");
    }

    return this.exchange.placeLimitOrder({
      symbol: this.smartTrade.exchangeSymbolId,
      side: order.side === "Buy" ? "buy" : "sell", // @todo map helper
      price: order.price,
      quantity: order.quantity,
    });
  }

  async cancelOrder(order: Prisma.OrderGetPayload<{}>) {
    if (!order.exchangeOrderId)
      throw new Error(
        `Order ${order.id} has missing \`exchangeOrderId\` field`,
      );

    await this.exchange.cancelLimitOrder({
      orderId: order.exchangeOrderId,
      symbol: this.smartTrade.exchangeSymbolId,
    });
    await xprisma.order.updateStatus("Canceled", order.id);
  }

  async cancelOrders() {
    for (const order of this.smartTrade.orders) {
      if (order.status === "Idle") {
        await xprisma.order.updateStatus("Revoked", order.id);
      } else if (order.status === "Placed") {
        try {
          await this.cancelOrder(order);
        } catch (err) {
          if (err instanceof OrderNotFound) {
            await xprisma.order.updateStatus("Deleted", order.id);
          } else {
            throw err;
          }
        }
      }
    }
  }
}
