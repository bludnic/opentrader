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
      async findByExchangeOrderId(exchangeOrderId: string) {
        return prisma.order.findFirst({
          where: {
            exchangeOrderId,
          },
          include: {
            smartTrade: true,
          },
        });
      },
      /**
       * This method is meant to just update the `status` in the DB when
       * synchronizing with the Exchange.
       */
      async updateStatus(
        status: Extract<$Enums.OrderStatus, 'Canceled' | 'Revoked' | 'Deleted'>,
        orderId: number,
      ) {
        const resetSmartTradeRef = {
          update: {
            ref: null,
          },
        };

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
      async updateStatusToFilled(data: {
        orderId: number;
        filledPrice: number | null;
      }) {
        const { orderId, filledPrice } = data;

        if (filledPrice === null) {
          throw new Error(
            'Cannot update order status to "filled" without specifying "filledPrice"',
          );
        }

        return prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: 'Filled',
            filledPrice,
          },
        });
      },
      async updateSyncedAt(orderId: number) {
        return prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            syncedAt: new Date(),
          },
        });
      },
    },
    smartTrade: {
      async setRef(id: number, ref: string | null) {
        return prisma.smartTrade.update({
          where: {
            id,
          },
          data: {
            ref,
          },
        });
      },
      async findByExchangeOrderId(exchangeOrderId: string) {
        return prisma.smartTrade.findFirst({
          where: {
            orders: {
              some: {
                exchangeOrderId,
              },
            },
          },
          include: {
            orders: true,
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
