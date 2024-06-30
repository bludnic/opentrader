import type { Prisma } from "@prisma/client";
import type { xprisma } from "../../xprisma.js";

export type ExchangeAccountWithCredentials = Prisma.PromiseReturnType<
  typeof xprisma.exchangeAccount.findUniqueOrThrow
>;
