import dynamic from "next/dynamic";
import React from "react";
import BotDetailsLoading from "src/components/bot/bot-details/loading";
import { toPage } from "src/utils/next/toPage";

const BotDetailsPage = dynamic(
  () => import("src/components/bot/bot-details/page"),
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

  if (process.env.NEXT_PUBLIC_STATIC === "true") {
    return (
      <div>
        Page is disabled due to the static export. Go to{" "}
        {toPage("bot/:id", botId)} instead
      </div>
    );
  }

  return <BotDetailsPage botId={botId} />;
}

// Workaround:
// Next.js throws an error when building a static app and empty array is returned.
// Error: Page "/api/trpc/[trpc]" is missing "generateStaticParams()"
export const generateStaticParams = () => [{ id: "_" }];
