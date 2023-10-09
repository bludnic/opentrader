import type { AppRouter } from "@opentrader/trpc";
//     👆 **type-only** import
import { createTRPCReact } from "@trpc/react-query";

export const tClient = createTRPCReact<AppRouter>({});
