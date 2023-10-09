import { trpc } from "./trpc";
import { isLoggedIn } from "./common/middlewares/isLoggedIn";

export const publicProcedure = trpc.procedure;
export const authorizedProcedure = publicProcedure.use(isLoggedIn);
