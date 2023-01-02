import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NextPage } from "next";

const componentName = "Index";
const classes = {
  root: `${componentName}-root`,
  box: `${componentName}-box`,
};
const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {
    width: "100%",
    height: "100vh",
  },
  [`& .${classes.box}`]: {
    height: "inherit",
  },
}));

const Home: NextPage = (props) => {
  return (
    <Root className={classes.root}>
      <Box
        className={classes.box}
        display="flex"
        alignItems="center"
        justifyContent="space-around"
      >
        <Typography variant="h6" color="success.main">
          0x6502
        </Typography>
      </Box>
    </Root>
  );
};

export default Home;
