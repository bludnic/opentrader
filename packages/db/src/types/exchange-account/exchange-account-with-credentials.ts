import type { Prisma } from "@prisma/client";
import type { xprisma } from "../../xprisma";

export type ExchangeAccountWithCredentials = Prisma.PromiseReturnType<
  typeof xprisma.exchangeAccount.findUniqueOrThrow
>;
