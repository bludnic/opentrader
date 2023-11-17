import Grid from "@mui/joy/Grid";
import Skeleton from "@mui/joy/Skeleton";

export default function Loading() {
  return (
    <Grid container spacing={2}>
      <Grid md={9}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={300}
        />
      </Grid>
      <Grid md={3}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height={300}
        />
      </Grid>
    </Grid>
  );
}
