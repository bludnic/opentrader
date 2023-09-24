import React, { FC, useEffect } from "react";
import { MainLayout } from "src/layouts/main";
import Page from "src/sections/grid-bot/create-bot/page";
import { initPage } from "src/sections/grid-bot/create-bot/store/init-page/reducers";
import { isPageReadySelector } from "src/sections/grid-bot/create-bot/store/init-page/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

const CreateBotPage: FC = () => {
  const dispatch = useAppDispatch();
  const isPageReady = useAppSelector(isPageReadySelector);

  useEffect(() => {
    dispatch(initPage());
  }, []);

  if (isPageReady) {
    return <Page />;
  }

  return (
    <MainLayout
      ContainerProps={{
        maxWidth: false,
        sx: {
          ml: 0, // align to left
        },
      }}
      NavigationProps={{
        back: {
          href: "/grid-bot",
        },
        title: "Grid Bots",
      }}
    >
      Loading...
    </MainLayout>
  );
};

export default CreateBotPage;
