import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs, GetFindResult, InternalArgs } from "@prisma/client/runtime/library";

import type { XBotType } from "@opentrader/types";
import { TBotState, ZDcaBotSettings } from "../../types/index.js";
import { TDcaBotSettings } from "../../types/dca-bot/index.js";

type NarrowBotType<ExtArgs extends InternalArgs, T> = Omit<
  Awaited<GetFindResult<Prisma.$BotPayload<ExtArgs>, T, {}>>,
  "settings" | "state"
> & {
  settings: TDcaBotSettings;
  state: TBotState;
};

const BOT_TYPE = "DcaBot" satisfies XBotType;

export const dcaBotModel = <ExtArgs extends InternalArgs = DefaultArgs>(prisma: PrismaClient) => ({
  async findUnique<T extends Prisma.BotFindUniqueArgs<ExtArgs>>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs<ExtArgs>>,
  ) {
    const bot = await prisma.bot.findUnique<T>({
      ...args,
      where: {
        ...args.where,
        type: BOT_TYPE,
      },
    });

    if (!bot) return null;

    if ("settings" in bot) {
      (bot as any).settings = ZDcaBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findUniqueOrThrow<T extends Prisma.BotFindUniqueOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findUniqueOrThrow<T>({
      ...args,
      where: {
        ...args.where,
        type: BOT_TYPE,
      },
    });

    if ("settings" in bot) {
      (bot as any).settings = ZDcaBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findFirstOrThrow<T extends Prisma.BotFindFirstOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstOrThrowArgs>,
  ) {
    if (args.where) {
      args.where.type = BOT_TYPE;
    }

    const bot = await prisma.bot.findFirstOrThrow<T>(args);

    if ("settings" in bot) {
      (bot as any).settings = ZDcaBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findMany<T extends Prisma.BotFindManyArgs>(args: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>) {
    if (args.where) {
      args.where.type = BOT_TYPE;
    }
    const bots = await prisma.bot.findMany<T>(args);

    return bots.map((bot) => {
      if ("settings" in bot) {
        (bot as any).settings = ZDcaBotSettings.parse(JSON.parse(bot.settings));
      }
      if ("state" in bot) {
        (bot as any).state = JSON.parse(bot.state) as TBotState;
      }

      return bot as unknown as NarrowBotType<ExtArgs, T>;
    });
  },
  async create<T extends Prisma.BotCreateArgs>(args: Prisma.SelectSubset<T, Prisma.BotCreateArgs>) {
    ZDcaBotSettings.parse(JSON.parse(args.data.settings));

    const bot = await prisma.bot.create<T>({
      ...args,
      data: {
        ...args.data,
        type: BOT_TYPE,
      },
    });

    if ("settings" in bot) {
      (bot as any).settings = ZDcaBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async update<T extends Prisma.BotUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>) {
    if (typeof args.data.settings === "string") {
      ZDcaBotSettings.parse(JSON.parse(args.data.settings));
    }

    const bot = await prisma.bot.update<T>({
      ...args,
      where: {
        ...args.where,
        type: BOT_TYPE,
      },
    });

    if ("settings" in bot) {
      (bot as any).settings = ZDcaBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
});
