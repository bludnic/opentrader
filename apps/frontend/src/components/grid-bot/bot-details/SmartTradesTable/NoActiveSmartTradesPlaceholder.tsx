import Typography from "@mui/joy/Typography";

export function NoActiveSmartTradesPlaceholder() {
  return (
    <tbody>
      <tr>
        <td colSpan={8}>
          <Typography
            level="h4"
            textAlign="center"
            fontWeight="400"
            sx={{
              py: 2,
            }}
          >
            No active SmartTrades. Please start the bot.
          </Typography>
        </td>
      </tr>
    </tbody>
  );
}
