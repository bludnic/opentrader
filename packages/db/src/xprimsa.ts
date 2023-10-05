import { prisma } from "./prisma";
import { gridBotModel } from "./extension/models/grid-bot.model";
import { orderModel } from "./extension/models/order.model";
import { smartTradeModel } from "./extension/models/smart-trade.model";

/**
 * Type utilities https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/type-utilities
 */
export const xprisma = prisma.$extends({
  name: "xprisma",
  model: {
    bot: {
      grid: gridBotModel,
    },
    order: orderModel,
    smartTrade: smartTradeModel,
  },
  result: {
    exchangeAccount: {
      credentials: {
        needs: {
          exchangeCode: true,
          apiKey: true,
          secretKey: true,
          password: true,
          isDemoAccount: true,
        },
        compute(exchangeAccount) {
          return {
            code: exchangeAccount.exchangeCode,
            apiKey: exchangeAccount.apiKey,
            secretKey: exchangeAccount.secretKey,
            password: exchangeAccount.password,
            isDemoAccount: exchangeAccount.isDemoAccount,
          };
        },
      },
    },
  },
});
