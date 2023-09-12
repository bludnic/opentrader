import { $Enums } from '@bifrost/prisma';
import { gridBot } from 'src/trpc/prisma/models/gridBot';
import { isGridBotSettings } from 'src/trpc/prisma/utils/grid-bot/guards';
import { prisma } from './prisma';

/**
 * Type utilities https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions/type-utilities
 *
 */
export const xprisma = prisma.$extends({
  name: 'xprisma',
  model: {
    bot: {
      grid: gridBot,
    },
    order: {
      async setStatus(orderId: number, status: $Enums.OrderStatus) {
        const isCanceled =
          status === 'Canceled' || status === 'Revoked' || status === 'Deleted';

        const resetSmartTradeRef = isCanceled
          ? {
              update: {
                ref: null,
              },
            }
          : undefined;

        return prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            status,
            smartTrade: resetSmartTradeRef,
          },
        });
      },
    },
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
    bot: {
      settingsTyped: {
        typed: {
          type: true,
          settings: true,
        },
        compute({ type, settings }) {
          if (isGridBotSettings(type, settings)) {
            return {
              type,
              settings,
            };
          }

          return {
            type,
            settings: null,
          };
        },
      },
    },
  },
});

export type XPrismaClient = typeof xprisma;

// @todo remove
// async function remove() {
//   const bot = await xprisma.bot.findUnique({
//     where: {
//       id: 1,
//     },
//     include: {
//       owner: true,
//     },
//   });
//
//   await xprisma.bot.create({
//     where: {
//       id: 1,
//     },
//     data: {},
//   });
//
//   const gridBot = await xprisma.bot.grid.findUnique({
//     where: {
//       id: 1,
//     },
//     include: {
//       owner: true,
//     },
//   });
//
//   if (gridBot) {
//     console.log(gridBot.owner.id);
//     gridBot.settings.gridLines;
//   }
//
//   const gridBots = await xprisma.bot.grid.findMany({
//     include: {
//       owner: true,
//     },
//   });
//   gridBots[0].owner;
//   gridBots[0].settings.gridLines;
//
//   const gridBotUpdated = await xprisma.bot.grid.update({
//     where: {
//       id: 1,
//     },
//     data: {
//       name: 'Hello',
//       settings: { hello: 123 },
//     },
//   });
//   gridBotUpdated.settings.gridLines.map((gridLine) => console.log(gridLine));
// }
