import { NextPage } from "next";
import dynamic from 'next/dynamic';

const GridBotPage = dynamic(
  () => import("src/sections/grid-bot/bot"),
  {
    ssr: false,
  }
);

const GridBotNextPage: NextPage = () => {
  return <GridBotPage />;
};

export default GridBotNextPage;
