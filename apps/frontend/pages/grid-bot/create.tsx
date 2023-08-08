import { NextPage } from "next";

import dynamic from "next/dynamic";
import React from "react";

const CreateGridBot = dynamic(
  () => import("src/sections/grid-bot/create-bot"),
  {
    ssr: false,
  }
);

const CreateGridBotNextPage: NextPage = () => {
  return (
    <CreateGridBot />
  );
};

export default CreateGridBotNextPage;
