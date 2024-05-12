import type { Prisma, PrismaClient } from "@prisma/client";
import type { TBotSettings } from "../../types";
import { ZBotSettings } from "../../types";

export const customBotModel = (prisma: PrismaClient) => ({
  async findFirst<T extends Prisma.BotFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstArgs>,
  ) {
    const bot = await prisma.bot.findFirst<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    if (!bot) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TBotSettings,
    };
  },
  async findUnique<T extends Prisma.BotFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs>,
  ) {
    const bot = await prisma.bot.findUnique<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    if (!bot) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TBotSettings,
    };
  },
  async findUniqueOrThrow<T extends Prisma.BotFindUniqueOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findUniqueOrThrow<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TBotSettings,
    };
  },
  async findFirstOrThrow<T extends Prisma.BotFindFirstOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findFirstOrThrow<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TBotSettings,
    };
  },
  async findMany<T extends Prisma.BotFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>,
  ) {
    const bots = await prisma.bot.findMany<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    return bots.map((bot) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
      const { settings, ...rest } = bot;

      return {
        ...rest,
        settings: bot.settings as unknown as TBotSettings,
      };
    });
  },
  async create<T extends Prisma.BotCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotCreateArgs>,
  ) {
    // @todo for now there is only runtime validation
    // need to figure out hot to make it type safe for TS
    ZBotSettings.parse(args.data.settings);

    const bot = await prisma.bot.create<T>({
      ...args,
      data: {
        ...args.data,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TBotSettings,
    };
  },
  async update<T extends Prisma.BotUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
  ) {
    // @todo for now there is only runtime validation
    // need to figure out hot to make it type safe for TS

    if (args.data.settings) {
      ZBotSettings.parse(args.data.settings);
    }

    const bot = await prisma.bot.update<T>({
      ...args,
      where: {
        ...args.where,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TBotSettings,
    };
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
