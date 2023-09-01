import { prisma } from './prisma';

export const xprisma = prisma.$extends({
  name: 'xprisma',
  result: {
    exchangeAccount: {
      credentials: {
        needs: {
          exchangeCode: true,
          apiKey: true,
          secretKey: true,
          passphrase: true,
          isDemoAccount: true,
        },
        compute(exchangeAccount) {
          return {
            code: exchangeAccount.exchangeCode,
            apiKey: exchangeAccount.apiKey,
            secretKey: exchangeAccount.secretKey,
            passphrase: exchangeAccount.passphrase,
            isDemoAccount: exchangeAccount.isDemoAccount,
          };
        },
      },
    },
  },
});

export type XPrismaClient = typeof xprisma;
