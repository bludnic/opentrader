import { router } from "../../trpc.js";
import { publicProcedure } from "../../procedures.js";
import { healhcheck } from "./healthcheck/handler.js";

export const publicRouter = router({
  healhcheck: publicProcedure.query(healhcheck),
});
