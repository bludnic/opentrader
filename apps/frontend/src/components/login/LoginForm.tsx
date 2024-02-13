"use client";

import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toPage } from "src/utils/next/toPage";

export function LoginForm() {
  const [email, setEmail] = useState("opentrader");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    window.localStorage.setItem("ADMIN_PASSWORD", password);
    router.replace(toPage("grid-bot"));
  };

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
        Welcome Trader!
      </Typography>
      <Typography level="body-sm">Sign in to continue.</Typography>

      <FormControl>
        <FormLabel>Username</FormLabel>

        <Input
          name="username"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username"
          type="text"
          value={email}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Password</FormLabel>

        <Input
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          type="password"
          value={password}
        />
      </FormControl>

      <Button
        onClick={handleLogin}
        sx={{
          mt: 1,
        }}
      >
        Log in
      </Button>
    </Sheet>
  );
}
