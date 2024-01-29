import Typography from "@mui/joy/Typography";

export function NoActiveSmartTradesPlaceholder() {
  return (
    <tbody>
      <tr>
        <td colSpan={8}>
          <Typography
            fontWeight="400"
            level="h4"
            sx={{
              py: 2,
            }}
            textAlign="center"
          >
            No active SmartTrades. Please start the bot.
          </Typography>
        </td>
      </tr>
    </tbody>
  );
}
