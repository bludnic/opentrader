import Box from "@mui/joy/Box";
import Skeleton from "@mui/joy/Skeleton";

export default function Loading() {
  return (
    <Box
      sx={{
        maxWidth: "1200px",
      }}
    >
      <Skeleton
        variant="rectangular"
        animation="wave"
        width="100%"
        height={280}
      />
    </Box>
  );
}
