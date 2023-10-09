import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@opentrader/trpc";
//     👆 **type-only** import

// @see https://trpc.io/docs/client/vanilla/infer-types
export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
