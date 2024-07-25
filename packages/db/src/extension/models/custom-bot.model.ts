import type { Prisma, PrismaClient } from "@prisma/client";
import type {
  DefaultArgs,
  GetFindResult,
  InternalArgs,
} from "@prisma/client/runtime/library";
import type { TBotSettings, TBotState } from "../../types/index.js";
import { ZBotSettings } from "../../types/index.js";

type NarrowBotType<ExtArgs extends InternalArgs, T> = Omit<
  Awaited<GetFindResult<Prisma.$BotPayload<ExtArgs>, T, {}>>,
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

    if ("settings" in bot) {
      (bot as any).settings = ZBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as NarrowBotType<ExtArgs, T>;
  },
  async findUnique<T extends Prisma.BotFindUniqueArgs<ExtArgs>>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs<ExtArgs>>,
  ) {
    const bot = await prisma.bot.findUnique<T>(args);
    if (!bot) return null;

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findUniqueOrThrow<T extends Prisma.BotFindUniqueOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findUniqueOrThrow<T>(args);

    if ("settings" in bot) {
      (bot as any).settings = ZBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findFirstOrThrow<T extends Prisma.BotFindFirstOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findFirstOrThrow<T>(args);

    if ("settings" in bot) {
      (bot as any).settings = ZBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async findMany<T extends Prisma.BotFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>,
  ) {
    const bots = await prisma.bot.findMany<T>(args);

    return bots.map((bot) => {
      if ("settings" in bot) {
        (bot as any).settings = ZBotSettings.parse(JSON.parse(bot.settings));
      }
      if ("state" in bot) {
        (bot as any).state = JSON.parse(bot.state) as TBotState;
      }

      return bot as unknown as NarrowBotType<ExtArgs, T>;
    });
  },
  async create<T extends Prisma.BotCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotCreateArgs>,
  ) {
    ZBotSettings.parse(JSON.parse(args.data.settings));

    const bot = await prisma.bot.create<T>({
      ...args,
      data: {
        ...args.data,
      },
    });

    if ("settings" in bot) {
      (bot as any).settings = ZBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
  },
  async update<T extends Prisma.BotUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
  ) {
    if (typeof args.data.settings === "string") {
      ZBotSettings.parse(JSON.parse(args.data.settings));
    }

    const bot = await prisma.bot.update<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    if ("settings" in bot) {
      (bot as any).settings = ZBotSettings.parse(JSON.parse(bot.settings));
    }
    if ("state" in bot) {
      (bot as any).state = JSON.parse(bot.state) as TBotState;
    }

    return bot as unknown as NarrowBotType<ExtArgs, T>;
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
