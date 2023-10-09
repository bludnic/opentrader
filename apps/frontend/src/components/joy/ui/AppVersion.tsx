import Chip from "@mui/joy/Chip";
import { version } from "package.json";

export const AppVersion = () => (
  <Chip variant="outlined" color="neutral">
    v{version}
  </Chip>
);
