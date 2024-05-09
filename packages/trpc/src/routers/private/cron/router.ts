import { router } from "../../../trpc";
import { authorizedProcedure } from "../../../procedures";
import { syncClosedOrders } from "./sync-closed-orders/handler";

export const cronRouter = router({
  syncClosedOrders: authorizedProcedure.mutation(syncClosedOrders),
});
