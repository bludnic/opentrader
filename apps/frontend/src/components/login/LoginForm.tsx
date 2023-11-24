import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";

export function LoginForm() {
  return (
    <Sheet
      sx={{
        width: 300,
        mx: "auto",
        py: 3,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "sm",
        boxShadow: "md",
      }}
      variant="outlined"
    >
      <Typography component="h1" level="h4">
        Welcome!
      </Typography>
      <Typography level="body-sm">Sign in to continue.</Typography>

      <FormControl>
        <FormLabel>Email</FormLabel>

        <Input name="email" placeholder="victor@vlas.pro" type="email" />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>

        <Input name="password" placeholder="password" type="password" />
      </FormControl>

      <Button
        sx={{
          mt: 1,
        }}
      >
        Log in
      </Button>
      <Button>Primary</Button>
      <Button color="neutral">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="danger">Danger</Button>
      <Button color="warning">Warning</Button>
      <Button color="neutral" variant="soft">
        Light
      </Button>

      <Typography
        endDecorator={<Link href="/sign-up">Sign up</Link>}
        fontSize="sm"
        sx={{
          alignSelf: "center",
        }}
      >
        Don&apos;t have an account?
      </Typography>
    </Sheet>
  );
}
