import { gridBotModel } from "./extension/models/grid-bot.model";
import { orderModel } from "./extension/models/order.model";
import { smartTradeModel } from "./extension/models/smart-trade.model";
import { PrismaClient } from "@prisma/client";

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
