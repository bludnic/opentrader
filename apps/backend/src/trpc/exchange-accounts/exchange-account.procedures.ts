import z from 'zod';
import { zt } from '@bifrost/prisma';
import { Injectable } from '@nestjs/common';
import { xprisma } from '../prisma';
import { TrpcService } from 'src/trpc/trpc.service';

@Injectable()
export class ExchangeAccountProcedures {
  constructor(private readonly trpc: TrpcService) {}

  getRouter() {
    return this.trpc.router({
      list: this.trpc.procedure
        .use(this.trpc.isLoggedIn)
        .query(async ({ ctx }) => {
          const exchangeAccounts = await xprisma.exchangeAccount.findMany({
            where: {
              ownerId: ctx.user.id,
            },
          });

          return {
            exchangeAccounts,
          };
        }),

      getOne: this.trpc.procedure
        .use(this.trpc.isLoggedIn)
        .input(z.number())
        .query(async ({ input, ctx }) => {
          const exchangeAccount = await xprisma.exchangeAccount.findUnique({
            where: {
              id: input,
              ownerId: ctx.user.id,
            },
          });

          return {
            exchangeAccount,
          };
        }),

      create: this.trpc.procedure
        .use(this.trpc.isLoggedIn)
        .input(
          zt.ExchangeAccountSchema.pick({
            exchangeCode: true,
            name: true,
            apiKey: true,
            secretKey: true,
            passphrase: true,
            isDemoAccount: true,
          }),
        )
        .mutation(async ({ input, ctx }) => {
          const exchangeAccount = await xprisma.exchangeAccount.create({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore-next-line
            // @todo enable strict: true
            data: {
              ...input,
              owner: {
                connect: {
                  id: ctx.user.id,
                },
              },
            },
          });

          return {
            exchangeAccount,
          };
        }),

      update: this.trpc.procedure
        .use(this.trpc.isLoggedIn)
        .input(
          z.object({
            id: z.number(),
            body: zt.ExchangeAccountSchema.pick({
              exchangeCode: true,
              name: true,
              apiKey: true,
              secretKey: true,
              passphrase: true,
              isDemoAccount: true,
            }),
          }),
        )
        .mutation(async ({ input, ctx }) => {
          const exchangeAccount = await xprisma.exchangeAccount.update({
            where: {
              id: input.id,
              ownerId: ctx.user.id,
            },
            data: input.body,
          });

          return {
            exchangeAccount,
          };
        }),
    });
  }
}
