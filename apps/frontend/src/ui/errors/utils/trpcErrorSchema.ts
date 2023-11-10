import {
  TRPC_ERROR_CODES_BY_KEY,
  type TRPC_ERROR_CODE_KEY,
  type TRPC_ERROR_CODE_NUMBER,
} from "@trpc/server/rpc";
import { z } from "zod";

const ERROR_CODE_NAMES = Object.keys(TRPC_ERROR_CODES_BY_KEY) as [
  TRPC_ERROR_CODE_KEY,
  ...TRPC_ERROR_CODE_KEY[],
];

const ERROR_CODE_NUMBERS = Object.values(TRPC_ERROR_CODES_BY_KEY) as [
  TRPC_ERROR_CODE_NUMBER,
  ...TRPC_ERROR_CODE_NUMBER[],
];

export const TRPCErrorSchema = z.object({
  shape: z.object({
    code: z.number(), // .enum(ERROR_CODE_NUMBERS) doesn't work with numbers
    message: z.string(),
    data: z.object({
      code: z.enum(ERROR_CODE_NAMES),
      httpStatus: z.number(),
      path: z.string(),
      stack: z.string(),
    }),
  }),
});

export type TTRPCErrorSchema = z.infer<typeof TRPCErrorSchema>;
