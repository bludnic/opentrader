import { router } from "#trpc/trpc";
import { authorizedProcedure } from "#trpc/procedures";
import { syncClosedOrders } from "./sync-closed-orders/handler";

export const cronRouter = router({
  syncClosedOrders: authorizedProcedure.mutation(syncClosedOrders),
});
