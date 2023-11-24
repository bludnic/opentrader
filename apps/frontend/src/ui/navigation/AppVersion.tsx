import Chip from "@mui/joy/Chip";

const version = "0.0.1";

export function AppVersion() {
  return (
    <Chip color="neutral" variant="outlined">
      v{version}
    </Chip>
  );
}
