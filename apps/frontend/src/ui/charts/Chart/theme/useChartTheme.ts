import { useColorScheme } from "@mui/joy/styles";
import { darkTheme } from "./dark";
import { lightTheme } from "./light";

export function useChartTheme() {
  const { mode } = useColorScheme();

  if (mode === "dark") {
    return darkTheme;
  }

  return lightTheme;
}
