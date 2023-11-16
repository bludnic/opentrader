import Tab, { tabClasses } from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import TabPanel from "@mui/joy/TabPanel";
import React, { FC, ReactNode } from "react";
import { changeFormType, GridBotFormType } from "src/store/bot-form";
import { selectFormType } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

const FormTypes: Record<GridBotFormType, GridBotFormType> = {
  simple: "simple",
  advanced: "advanced",
};

type FormTypeTabsProps = {
  simpleForm: ReactNode;
  advancedForm: ReactNode;
};

export const FormTypeTabs: FC<FormTypeTabsProps> = ({
  simpleForm,
  advancedForm,
}) => {
  const formType = useAppSelector(selectFormType);
  const dispatch = useAppDispatch();

  const handleChange = (
    event: React.SyntheticEvent<Element, Event> | null,
    newValue: GridBotFormType | null,
  ) => {
    // disallow un-toggling current button
    if (newValue === null) return;

    dispatch(changeFormType(newValue));
  };

  return (
    <Tabs
      value={formType}
      onChange={(event, newValue) =>
        handleChange(event, newValue as GridBotFormType)
      }
      defaultValue={FormTypes.simple}
      sx={{
        borderRadius: "md",
        overflow: "auto",
        boxShadow: "sm",
      }}
    >
      <TabList
        tabFlex="auto"
        disableUnderline
        sx={{
          [`& .${tabClasses.root}`]: {
            // fontSize: "sm",
            // fontWeight: "lg",
            bgcolor: "background.backdrop",
            [`&[aria-selected="true"]`]: {
              // color: "primary.500",
              bgcolor: "background.surface",
              fontWeight: "lg",
            },
            // [`&.${tabClasses.focusVisible}`]: {
            //   outlineOffset: "-4px",
            // },
          },
        }}
      >
        <Tab value={FormTypes.simple} disableIndicator>
          Easy form
        </Tab>
        <Tab value={FormTypes.advanced} disableIndicator>
          Advanced form
        </Tab>
      </TabList>

      <TabPanel value={FormTypes.simple}>{simpleForm}</TabPanel>
      <TabPanel value={FormTypes.advanced}>{advancedForm}</TabPanel>
    </Tabs>
  );
};
