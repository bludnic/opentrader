import Box from "@mui/joy/Box";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import Tab from "@mui/joy/Tab";
import Button from "@mui/joy/Button";

export function TopNavigation() {
  return (
    <>
      <Button variant="plain" size="lg" color="neutral">
        Bots
      </Button>

      <Button variant="plain" size="lg" color="neutral">
        Exchange Accounts
      </Button>
    </>

  );
}
