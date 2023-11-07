import Chip from "@mui/joy/Chip";

const version = "0.0.1";

export const AppVersion = () => (
  <Chip variant="outlined" color="neutral">
    v{version}
  </Chip>
);
