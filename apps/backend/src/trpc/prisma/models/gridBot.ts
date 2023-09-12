import { Prisma } from '@bifrost/prisma';
import { prisma } from 'src/trpc/prisma/prisma';
import {
  TGridBotSettings,
  ZGridBotSettings,
} from 'src/trpc/prisma/types/grid-bot/grid-bot-settings.schema';

export const gridBot = {
  async findUnique<T extends Prisma.BotFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueArgs>,
  ) {
    const bot = await prisma.bot.findUnique<T>({
      ...args,
      where: {
        ...args.where,
        type: 'GridBot',
      },
    });

    if (!bot) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
    };
  },
  async findUniqueOrThrow<T extends Prisma.BotFindUniqueOrThrowArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindUniqueOrThrowArgs>,
  ) {
    const bot = await prisma.bot.findUniqueOrThrow<T>({
      ...args,
      where: {
        ...args.where,
        type: 'GridBot',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
    };
  },
  async findMany<T extends Prisma.BotFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BotFindManyArgs>,
  ) {
    const bots = await prisma.bot.findMany<T>({
      ...args,
      where: {
        ...args.where,
        type: 'GridBot',
      },
    });

    return bots.map((bot) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { settings, ...rest } = bot;

      return {
        ...rest,
        settings: bot.settings as unknown as TGridBotSettings,
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
      type: 'GridBot',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
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
        type: 'GridBot',
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { settings, ...rest } = bot;

    return {
      ...rest,
      settings: bot.settings as unknown as TGridBotSettings,
    };
  },
};
