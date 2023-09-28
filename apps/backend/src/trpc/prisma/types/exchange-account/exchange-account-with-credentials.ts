import { Prisma } from '@bifrost/prisma';
import { xprisma } from 'src/trpc/prisma/xprisma';

export type ExchangeAccountWithCredentials = Prisma.PromiseReturnType<
  typeof xprisma.exchangeAccount.findUniqueOrThrow
>;
