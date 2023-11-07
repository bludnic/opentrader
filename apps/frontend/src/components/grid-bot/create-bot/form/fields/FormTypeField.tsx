import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";
import IconButton from "@mui/joy/IconButton";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import React, { FC } from "react";
import { changeFormType, GridBotFormType } from "src/store/bot-form";
import { selectFormType } from "src/store/bot-form/selectors";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

type FormTypeFieldProps = {
  className?: string;
};

export const FormTypeField: FC<FormTypeFieldProps> = (props) => {
  const { className } = props;
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
      aria-label="Basic tabs"
      value={formType}
      onChange={(event, newValue) =>
        handleChange(event, newValue as GridBotFormType)
      }
      sx={{
        mt: -2,
        mx: -2,
        borderRadius: "md",
        overflow: "auto",
      }}
    >
      <TabList
        tabFlex="auto"
        disableUnderline
        sx={
          {
            // borderTopLeftRadius: 8,
            // borderTopRightRadius: 8,
          }
        }
      >
        <Tab
          sx={
            {
              // borderTopLeftRadius: "inherit",
            }
          }
          value="simple"
          disableIndicator
        >
          Easy form
        </Tab>
        <Tab
          sx={
            {
              // borderTopRightRadius: "inherit",
            }
          }
          value="advanced"
          disableIndicator
        >
          Advanced form
        </Tab>
      </TabList>
    </Tabs>
  );

  return (
    <ToggleButtonGroup
      className={className}
      value={formType}
      onChange={handleChange}
      variant="outlined"
    >
      <IconButton value="simple">Simple form</IconButton>
      <IconButton value="advanced">Advanced form</IconButton>
    </ToggleButtonGroup>
  );
};
