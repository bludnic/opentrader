"use client";

import dynamic from "next/dynamic";
import React from "react";
import BotListLoading from "src/components/grid-bot/bots-list/loading";

const BotListPage = dynamic(
  () => import("src/components/grid-bot/bots-list/page"),
  {
    loading: BotListLoading,
    ssr: false,
  },
);

export default function Page() {
  return <BotListPage />;
}
