import { useState } from "react";

export function useIsStale<T>(value: T) {
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);

    return true;
  }

  return false;
}
