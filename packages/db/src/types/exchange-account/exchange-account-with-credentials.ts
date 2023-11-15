import { Prisma } from "@prisma/client";
import { xprisma } from "#db/xprimsa";

export type ExchangeAccountWithCredentials = Prisma.PromiseReturnType<
  typeof xprisma.exchangeAccount.findUniqueOrThrow
>;
