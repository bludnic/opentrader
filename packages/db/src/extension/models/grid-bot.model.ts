import type { Prisma, PrismaClient } from "@prisma/client";
import type { TBotState } from "../../types";
import type { TGridBotSettings } from "../../types/grid-bot";
import { ZGridBotSettings } from "../../types/grid-bot";

export const gridBotModel = (prisma: PrismaClient) => ({
  async findUnique<T extends Prisma.BotFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs>,
  ) {
    const bot = await prisma.bot.findUnique<T>({
      ...args,
      where: {
        ...args.where,
        type: "GridBot",
      },
    });

    if (!bot) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, state, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
      state: bot.state as unknown as TBotState,
    };
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, state, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
      state: bot.state as unknown as TBotState,
    };
  },
  async findFirstOrThrow<T extends Prisma.BotFindFirstOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindFirstOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findFirstOrThrow<T>({
      ...args,
      where: {
        ...args.where,
        type: "GridBot",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, state, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
      state: bot.state as unknown as TBotState,
    };
  },
  async findMany<T extends Prisma.BotFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>,
  ) {
    const bots = await prisma.bot.findMany<T>({
      ...args,
      where: {
        ...args.where,
        type: "GridBot",
      },
    });

    return bots.map((bot) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
      const { settings, state, ...rest } = bot;

      return {
        ...rest,
        settings: bot.settings as unknown as TGridBotSettings,
        state: bot.state as unknown as TBotState,
      };
    });
  },
  async create<T extends Prisma.BotCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotCreateArgs>,
  ) {
    // @todo for now there is only runtime validation
    // need to figure out hot to make it type safe for TS
    ZGridBotSettings.parse(args.data.settings);

    const bot = await prisma.bot.create<T>({
      ...args,
      data: {
        ...args.data,
        type: "GridBot",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, state, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
      state: bot.state as unknown as TBotState,
    };
  },
  async update<T extends Prisma.BotUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotUpdateArgs>,
  ) {
    // @todo for now there is only runtime validation
    // need to figure out hot to make it type safe for TS

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required to destruct
    const { settings, state, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
      state: bot.state as unknown as TBotState,
    };
  },
});
