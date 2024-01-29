"use client";

import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";

type Props = {
  botId: number;
};

export function BotSettingsForm({ botId }: Props) {
  const { data } = tClient.bot.getOne.useQuery(botId);
  const { isLoading, mutate } = tClient.bot.update.useMutation();

  const handleMutate = () => {
    mutate({
      botId,
      data: {
        settings: {
          template: {
            name: "LowCapStrategy",
            params: {
              expectedDrop: 0.5, // 0.5%
            },
          },
          symbols: ["BTC/USDT", "ETH/USDT", "UNI/USDT", "OKB/USDT"],
          strategy: {
            timeframe: "1m",
            runOn: {
              candleClosed: true,
              orderFilled: true,
              interval: 10000,
            },
          },
        },
      },
    });
  };

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <Button onClick={handleMutate}>Update settings</Button>
    </div>
  );
}
