import { useState } from "react";

export function useIsStale<T>(value: T) {
  const [preValue, setPrevValue] = useState(value);
  if (value !== preValue) {
    setPrevValue(value);

    return true;
  }

  return false;
}
