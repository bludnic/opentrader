import Button from "@mui/joy/Button";
import NextLink from "next/link";

export function TopNavigation() {
  return (
    <>
      <Button
        variant="plain"
        size="lg"
        color="neutral"
        component={NextLink}
        href="/dashboard/grid-bot"
      >
        Bots
      </Button>

      <Button
        variant="plain"
        size="lg"
        color="neutral"
        component={NextLink}
        href="/dashboard/accounts"
      >
        Exchange Accounts
      </Button>
    </>
  );
}
