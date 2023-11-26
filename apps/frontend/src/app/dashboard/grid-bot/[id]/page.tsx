import dynamic from "next/dynamic";
import React from "react";
import BotDetailsLoading from "src/components/grid-bot/bot-details/loading";

const BotDetailsPage = dynamic(
  () => import("src/components/grid-bot/bot-details/page"),
  {
    loading: BotDetailsLoading,
    ssr: false,
  },
);

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  const botId = Number(params.id);

  return <BotDetailsPage botId={botId} />;
}
