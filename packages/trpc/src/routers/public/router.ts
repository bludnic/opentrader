import { router } from "../../trpc";
import { publicProcedure } from "../../procedures";
import { healhcheck } from "./healthcheck/handler";

export const publicRouter = router({
  healhcheck: publicProcedure.query(healhcheck),
});
