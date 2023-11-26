"use client";

import Accordion from "@mui/joy/Accordion";
import AccordionGroup from "@mui/joy/AccordionGroup";
import AccordionSummary, {
  accordionSummaryClasses,
} from "@mui/joy/AccordionSummary";
import AccordionDetails, {
  accordionDetailsClasses,
} from "@mui/joy/AccordionDetails";
import React, { FC, ReactNode } from "react";

type BotAdditionalActionsProps = {
  children: ReactNode;
};

export const BotAdditionalActions: FC<BotAdditionalActionsProps> = ({
  children,
}) => {
  return (
    <AccordionGroup
      variant="plain"
      transition="0.2s"
      size="lg"
      sx={(theme) => ({
        // maxWidth: 400,
        mx: -2,
        mb: -2,
        borderRadius: "md",
        [`& .${accordionSummaryClasses.button}`]: {
          color: theme.vars.palette.text.tertiary,
        },
        [`& .${accordionDetailsClasses.root}`]: {
          backgroundColor: "transparent",
          color: theme.vars.palette.text.primary,
          border: 0,
        },
        [`& .${accordionDetailsClasses.content}`]: {
          gap: "0.75rem",

          [`&.${accordionDetailsClasses.expanded}`]: {
            paddingBlock: "0.75rem",
          },
        },
      })}
    >
      <Accordion>
        <AccordionSummary>More actions</AccordionSummary>
        <AccordionDetails variant="soft">{children}</AccordionDetails>
      </Accordion>
    </AccordionGroup>
  );
};
