import { trpc } from "./trpc.js";
import { isLoggedIn } from "./common/middlewares/isLoggedIn.js";

export const publicProcedure = trpc.procedure;
export const authorizedProcedure = publicProcedure.use(isLoggedIn);
