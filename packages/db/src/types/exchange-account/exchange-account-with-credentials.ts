import { Prisma } from "@opentrader/prisma";
import { xprisma } from "#db/xprimsa";

export type ExchangeAccountWithCredentials = Prisma.PromiseReturnType<
  typeof xprisma.exchangeAccount.findUniqueOrThrow
>;
