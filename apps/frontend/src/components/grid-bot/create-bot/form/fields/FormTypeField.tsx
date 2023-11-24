import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import type { FC } from "react";
import React from "react";
import type { GridBotFormType } from "src/store/bot-form";
import { changeFormType } from "src/store/bot-form";
import { selectFormType } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export const FormTypeField: FC = () => {
  const formType = useAppSelector(selectFormType);
  const dispatch = useAppDispatch();

  const handleChange = (
    event: React.SyntheticEvent | null,
    newValue: GridBotFormType | null,
  ) => {
    // disallow un-toggling current button
    if (newValue === null) return;

    dispatch(changeFormType(newValue));
  };

  return (
    <Tabs
      aria-label="Basic tabs"
      onChange={(event, newValue) => {
        handleChange(event, newValue as GridBotFormType);
      }}
      sx={{
        mt: -2,
        mx: -2,
        borderRadius: "md",
        overflow: "auto",
      }}
      value={formType}
    >
      <TabList
        disableUnderline
        sx={
          {
            // borderTopLeftRadius: 8,
            // borderTopRightRadius: 8,
          }
        }
        tabFlex="auto"
      >
        <Tab
          disableIndicator
          sx={
            {
              // borderTopLeftRadius: "inherit",
            }
          }
          value="simple"
        >
          Easy form
        </Tab>
        <Tab
          disableIndicator
          sx={
            {
              // borderTopRightRadius: "inherit",
            }
          }
          value="advanced"
        >
          Advanced form
        </Tab>
      </TabList>
    </Tabs>
  );
};
