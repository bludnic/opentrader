import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  DefaultArgs,
  GetFindResult,
  InternalArgs,
} from "@prisma/client/runtime/library";
import type { TBotState, TGridBotSettings } from "../../types";
import { ZGridBotSettings } from "../../types/grid-bot";

type NarrowBotType<ExtArgs extends InternalArgs, T> = Omit<
  Awaited<GetFindResult<Prisma.$BotPayload<ExtArgs>, T>>,
  "settings" | "state"
> & {
  settings: TGridBotSettings;
  state: TBotState;
};

export const gridBotModel = <ExtArgs extends InternalArgs = DefaultArgs>(
  prisma: PrismaClient,
) => ({
  async findUnique<T extends Prisma.BotFindUniqueArgs<ExtArgs>>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs<ExtArgs>>,
  ) {
    const bot = await prisma.bot.findUnique<T>({
      ...args,
      where: {
        ...args.where,
        type: "GridBot",
      },
    });

    if (!bot) return null;

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findUniqueOrThrow<T extends Prisma.BotFindUniqueOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findUniqueOrThrow<T>({
      ...args,
      where: {
        ...args.where,
        type: "GridBot",
      },
    });

    if ("settings" in bot) {
      bot.settings = ZGridBotSettings.parse(bot.settings);
    }
    if ("state" in bot) {
      bot.state = bot.state as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findFirstOrThrow<T extends Prisma.BotFindFirstOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstOrThrowArgs>,
  ) {
    if (args.where) {
      args.where.type = "GridBot";
    }

    const bot = await prisma.bot.findFirstOrThrow<T>(args);

    if ("settings" in bot) {
      bot.settings = ZGridBotSettings.parse(bot.settings);
    }
    if ("state" in bot) {
      bot.state = bot.state as TBotState;
    }

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async findMany<T extends Prisma.BotFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>,
  ) {
    if (args.where) {
      args.where.type = "GridBot";
    }
    const bots = await prisma.bot.findMany<T>(args);

    return bots.map((bot) => {
      if ("settings" in bot) {
        bot.settings = ZGridBotSettings.parse(bot.settings);
      }
      if ("state" in bot) {
        bot.state = bot.state as unknown as TBotState;
      }

      return bot as unknown as NarrowBotType<ExtArgs, T>;
    });
  },
  async create<T extends Prisma.BotCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotCreateArgs>,
  ) {
    ZGridBotSettings.parse(args.data.settings);

    const bot = await prisma.bot.create<T>({
      ...args,
      data: {
        ...args.data,
        type: "GridBot",
      },
    });

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async update<T extends Prisma.BotUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
  ) {
    if (args.data.settings) {
      ZGridBotSettings.parse(args.data.settings);
    }

    const bot = await prisma.bot.update<T>({
      ...args,
      where: {
        ...args.where,
        type: "GridBot",
      },
    });

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
});
