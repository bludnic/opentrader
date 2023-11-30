"use client";

import lazy from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React from "react";
import BotDetailsLoading from "src/components/grid-bot/bot-details/loading";

const BotDetailsPage = lazy(
  () => import("src/components/grid-bot/bot-details/page"),
  {
    loading: BotDetailsLoading,
    ssr: false,
  },
);

// This page is used only when building a static app (`export`)
// It is a replacement of dynamic path `/grid-bot/[id]/page.tsx`
export default function Page() {
  const params = useSearchParams();
  const botId = Number(params.get("id"));

  return <BotDetailsPage botId={botId} />;
}
