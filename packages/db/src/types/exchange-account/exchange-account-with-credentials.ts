import { Prisma } from "@opentrader/prisma";
import { xprisma } from "@opentrader/db/xprimsa";

export type ExchangeAccountWithCredentials = Prisma.PromiseReturnType<
  typeof xprisma.exchangeAccount.findUniqueOrThrow
>;
