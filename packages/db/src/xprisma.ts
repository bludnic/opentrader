import { PrismaClient } from "@prisma/client";
import { gridBotModel } from "./extension/models/grid-bot.model";
import { orderModel } from "./extension/models/order.model";
import { smartTradeModel } from "./extension/models/smart-trade.model";
import { customBotModel } from "./extension/models/custom-bot.model";

function newPrismaClientInstance() {
  console.log("❕ DB: Created new instance of PrismaClient");
  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  xprisma: typeof xprismaClient;
};

const prismaClient = globalForPrisma.prisma || newPrismaClientInstance();

const xprismaClient = prismaClient.$extends({
  name: "xprisma",
  model: {
    bot: {
      grid: gridBotModel(prismaClient),
      custom: customBotModel(prismaClient),

      /**
       * Additional helpers for bot model
       */
      async setProcessing(value: boolean, botId: number) {
        return prismaClient.bot.update({
          where: {
            id: botId,
          },
          data: {
            processing: value,
          },
        });
      },
      async updateState(state: object, botId: number) {
        return prismaClient.bot.update({
          where: {
            id: botId,
          },
          data: {
            state,
          },
        });
      },
    },
    order: orderModel(prismaClient),
    smartTrade: smartTradeModel(prismaClient),
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

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
  globalForPrisma.xprisma = xprismaClient;
}

export const xprisma = globalForPrisma.xprisma || xprismaClient;
