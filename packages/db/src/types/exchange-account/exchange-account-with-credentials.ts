import type { Prisma } from "@prisma/client";
import { xprisma } from "#db/xprisma";

export type ExchangeAccountWithCredentials = Prisma.PromiseReturnType<
  typeof xprisma.exchangeAccount.findUniqueOrThrow
>;
