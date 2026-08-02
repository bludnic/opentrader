import { PrismaClient } from "@prisma/client";
import { MarketData, StrategyAction, StrategyError, StrategyEventType } from "@opentrader/types";
import { dcaBotModel } from "./extension/models/dca-bot.model.js";
import { gridBotModel } from "./extension/models/grid-bot.model.js";
import { orderModel } from "./extension/models/order.model.js";
import { smartTradeModel } from "./extension/models/smart-trade.model.js";
import { customBotModel } from "./extension/models/custom-bot.model.js";
import { encryptExchangeAccountFields, decryptExchangeAccountRow } from "./encryption.js";

function newPrismaClientInstance() {
  // console.log("❕ DB: Created new instance of PrismaClient");
  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  xprisma: typeof xprismaClient;
};

const prismaClient = globalForPrisma.prisma || newPrismaClientInstance();

/**
 * Encrypts apiKey/secretKey/password on the way into the DB and decrypts them on the way
 * out, so every caller of xprisma.exchangeAccount.* gets plaintext credentials in memory
 * exactly like before, while the DB itself only ever stores ciphertext. This is layered
 * before the rest of the xprisma extensions (below) so their computed `credentials` field
 * sees already-decrypted values.
 */
const encryptedPrismaClient = prismaClient.$extends({
  name: "xprisma-credentials-encryption",
  query: {
    exchangeAccount: {
      async create({ args, query }) {
        if (args.data) encryptExchangeAccountFields(args.data);
        const result = await query(args);
        return decryptExchangeAccountRow(result);
      },
      async update({ args, query }) {
        if (args.data) encryptExchangeAccountFields(args.data as Record<string, unknown>);
        const result = await query(args);
        return decryptExchangeAccountRow(result);
      },
      async findUnique({ args, query }) {
        const result = await query(args);
        return result ? decryptExchangeAccountRow(result) : result;
      },
      async findUniqueOrThrow({ args, query }) {
        const result = await query(args);
        return decryptExchangeAccountRow(result);
      },
      async findFirst({ args, query }) {
        const result = await query(args);
        return result ? decryptExchangeAccountRow(result) : result;
      },
      async findFirstOrThrow({ args, query }) {
        const result = await query(args);
        return decryptExchangeAccountRow(result);
      },
      async findMany({ args, query }) {
        const results = await query(args);
        return results.map(decryptExchangeAccountRow);
      },
    },
  },
});

const xprismaClient = encryptedPrismaClient.$extends({
  name: "xprisma",
  model: {
    bot: {
      grid: gridBotModel(prismaClient),
      dca: dcaBotModel(prismaClient),
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
            state: JSON.stringify(state),
          },
        });
      },
    },
    botLog: {
      async log(params: {
        startedAt: Date;
        endedAt: Date;
        botId: number;
        action: StrategyAction;
        triggerEventType?: StrategyEventType;
        context?: MarketData;
        error?: StrategyError;
      }) {
        return prismaClient.botLog.create({
          data: {
            action: params.action,
            triggerEventType: params.triggerEventType,
            context: JSON.stringify(params.context),
            error: JSON.stringify(params.error),
            startedAt: params.startedAt,
            endedAt: params.endedAt,
            bot: {
              connect: {
                id: params.botId,
              },
            },
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
          isPaperAccount: true,
        },
        compute(exchangeAccount) {
          return {
            code: exchangeAccount.exchangeCode,
            apiKey: exchangeAccount.apiKey,
            secretKey: exchangeAccount.secretKey,
            password: exchangeAccount.password,
            isDemoAccount: exchangeAccount.isDemoAccount,
            isPaperAccount: exchangeAccount.isPaperAccount,
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
