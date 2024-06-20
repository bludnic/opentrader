import { router } from "../../../trpc.js";
import { authorizedProcedure } from "../../../procedures.js";
import { syncClosedOrders } from "./sync-closed-orders/handler.js";

export const cronRouter = router({
  syncClosedOrders: authorizedProcedure.mutation(syncClosedOrders),
});
