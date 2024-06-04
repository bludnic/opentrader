import type { Prisma, PrismaClient } from "@prisma/client";
import {
  DefaultArgs,
  GetFindResult,
  InternalArgs,
} from "@prisma/client/runtime/library";
import type { TBotSettings, TBotState } from "../../types";
import { ZBotSettings } from "../../types";

type NarrowBotType<ExtArgs extends InternalArgs, T> = Omit<
  Awaited<GetFindResult<Prisma.$BotPayload<ExtArgs>, T>>,
  "settings" | "state"
> & {
  settings: TBotSettings;
  state: TBotState;
};

export const customBotModel = <ExtArgs extends InternalArgs = DefaultArgs>(
  prisma: PrismaClient,
) => ({
  async findFirst<T extends Prisma.BotFindFirstArgs<ExtArgs>>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstArgs<ExtArgs>>,
  ) {
    const bot = await prisma.bot.findFirst<T>(args);
    if (!bot) return null;

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async findUnique<T extends Prisma.BotFindUniqueArgs<ExtArgs>>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs<ExtArgs>>,
  ) {
    const bot = await prisma.bot.findUnique<T>(args);
    if (!bot) return null;

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async findUniqueOrThrow<T extends Prisma.BotFindUniqueOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findUniqueOrThrow<T>(args);

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async findFirstOrThrow<T extends Prisma.BotFindFirstOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findFirstOrThrow<T>(args);

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async findMany<T extends Prisma.BotFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>,
  ) {
    const bots = await prisma.bot.findMany<T>(args);

    return bots.map((bot) => {
      return bot as NarrowBotType<ExtArgs, T>;
    });
  },
  async create<T extends Prisma.BotCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotCreateArgs>,
  ) {
    ZBotSettings.parse(args.data.settings);

    const bot = await prisma.bot.create<T>({
      ...args,
      data: {
        ...args.data,
      },
    });

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async update<T extends Prisma.BotUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
  ) {
    if (args.data.settings) {
      ZBotSettings.parse(args.data.settings);
    }

    const bot = await prisma.bot.update<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async setProcessing(value: boolean, botId: number) {
    return prisma.bot.update({
      where: {
        id: botId,
      },
      data: {
        processing: value,
      },
    });
  },
});
