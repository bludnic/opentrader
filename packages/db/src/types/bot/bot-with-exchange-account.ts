import { Prisma } from "@prisma/client";
import { TBot } from "../bot/bot.schema.js";

const exchangeAccount = Prisma.validator<Prisma.ExchangeAccountDefaultArgs>()({});

export type TBotWithExchangeAccount = TBot & {
  exchangeAccount: Prisma.ExchangeAccountGetPayload<typeof exchangeAccount>;
};
