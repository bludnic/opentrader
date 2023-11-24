import { xprisma } from "@opentrader/db";
import { SmartTradeProcessor } from "@opentrader/processing";
import {
  ORDER_PUBLISHER_INTERVAL,
  ORDER_PUBLISHER_TIMEOUT_IF_NO_ORDERS,
} from "./constants";

export class OrderPublisher {
  private enabled = false;

  enable() {
    this.enabled = true;

    void this.runJob();
  }

  disable() {
    this.enabled = false;
  }

  async runJob() {
    if (!this.enabled) {
      console.log("OrderPublisher: Job cron disabled");
      return;
    }

    const startSyncTime = new Date().toISOString();
    console.debug(
      `[OrderPublisher] Checking for pending orders: ${startSyncTime}`,
    );

    const smartTrades = await xprisma.smartTrade.findMany({
      where: {
        type: "Trade",
        orders: {
          some: {
            status: "Idle",
          },
        },
      },
      include: {
        exchangeAccount: true,
        orders: true,
      },
    });

    if (smartTrades.length === 0) {
      console.debug(
        `[OrderPublisher] No SmartTrades to be placed. Skip sync process. Timeout ${
          ORDER_PUBLISHER_TIMEOUT_IF_NO_ORDERS / 1000
        }s`,
      );
      setTimeout(() => {
        void this.runJob();
      }, ORDER_PUBLISHER_TIMEOUT_IF_NO_ORDERS);
      return;
    }

    // this.logger.debug(`Smart Trades amount: ${smartTrades.length}`);

    for (const smartTrade of smartTrades) {
      const { exchangeAccount } = smartTrade;

      // const startSyncBotTime = new Date().toISOString();
      // this.logger.debug(
      //   `Start syncing ${exchangeAccount.exchangeCode} accountId: ${exchangeAccount.id} at time: ${startSyncBotTime}`,
      // );

      const smartTradeService = new SmartTradeProcessor(
        smartTrade,
        exchangeAccount,
      );
      await smartTradeService.placeNext();

      // const endSyncBotTime = new Date().toISOString();
      // this.logger.debug(
      //   `${exchangeAccount.exchangeCode} Exchange account ID: ${exchangeAccount.id} synced successfully at ${endSyncBotTime}`,
      // );
    }

    // const endSyncTime = new Date().toISOString();
    // this.logger.debug(`End syncing process: ${endSyncTime}`);

    setTimeout(() => {
      void this.runJob();
    }, ORDER_PUBLISHER_INTERVAL);
  }
}
