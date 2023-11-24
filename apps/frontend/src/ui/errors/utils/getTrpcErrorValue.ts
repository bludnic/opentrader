import type { TTRPCErrorSchema } from "./trpcErrorSchema";

type ErrorData = TTRPCErrorSchema["shape"]["data"];

export function getTRPCErrorValue<K extends keyof ErrorData>(
  obj: Record<string, unknown>,
  key: K,
): ErrorData[K] | undefined {
  if (key in obj) {
    return obj[key] as ErrorData[K];
  }
}
