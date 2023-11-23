"use client";

import dynamic from "next/dynamic";
import CreatBotLoading from "src/components/grid-bot/create-bot/loading";

const CreateBotPage = dynamic(
  () => import("src/components/grid-bot/create-bot/page"),
  {
    loading: CreatBotLoading,
    ssr: false,
  },
);

export default function Page() {
  return <CreateBotPage />;
}
