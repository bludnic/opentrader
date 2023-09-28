import { trpc } from 'src/trpc/trpc';
import { isLoggedIn } from 'src/trpc/common/middlewares/isLoggedIn';

export const publicProcedure = trpc.procedure;
export const authorizedProcedure = publicProcedure.use(isLoggedIn);
