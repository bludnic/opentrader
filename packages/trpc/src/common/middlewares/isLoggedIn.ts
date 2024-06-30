import { TRPCError } from "@trpc/server";
import { middleware } from "../../trpc.js";

export const isLoggedIn = middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      // Infers the `user` as non-nullable
      user: ctx.user,
    },
  });
});
