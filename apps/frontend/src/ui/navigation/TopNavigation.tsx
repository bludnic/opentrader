import Button from "@mui/joy/Button";
import NextLink from "next/link";
import { toPage } from "src/utils/next/toPage";

export function TopNavigation() {
  return (
    <>
      <Button
        color="neutral"
        component={NextLink}
        href={toPage("grid-bot")}
        size="lg"
        variant="plain"
      >
        Bots
      </Button>

      <Button
        color="neutral"
        component={NextLink}
        href={toPage("accounts")}
        size="lg"
        variant="plain"
      >
        Exchange Accounts
      </Button>
    </>
  );
}
