import Button from "@mui/joy/Button";
import NextLink from "next/link";

export function TopNavigation() {
  return (
    <>
      <Button
        color="neutral"
        component={NextLink}
        href="/dashboard/grid-bot"
        size="lg"
        variant="plain"
      >
        Bots
      </Button>

      <Button
        color="neutral"
        component={NextLink}
        href="/dashboard/accounts"
        size="lg"
        variant="plain"
      >
        Exchange Accounts
      </Button>
    </>
  );
}
