"use client";

import CircularProgress from "@mui/joy/CircularProgress";
import Button from "@mui/joy/Button";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import React from "react";
import { tClient } from "src/lib/trpc/client";
import { selectBotFormState } from "src/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";
import { useSnackbar } from "src/ui/snackbar";
import { toPage } from "src/utils/next/toPage";
import { mapFormToDto } from "./helpers/mapFormToDto";

export const SubmitButton: FC = () => {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const botFormState = useAppSelector(selectBotFormState);

  const { mutate, isLoading } = tClient.gridBot.create.useMutation({
    onSuccess(bot) {
      showSnackbar("Bot created successfully");

      setTimeout(() => {
        router.push(toPage("grid-bot/:id", bot.id));
      }, 1000);
    },
  });

  const handleSubmit = () => {
    const dto = mapFormToDto(botFormState);

    mutate(dto);
  };

  return (
    <Button
      color="primary"
      disabled={isLoading}
      onClick={handleSubmit}
      startDecorator={isLoading ? <CircularProgress size="md" /> : null}
      type="submit"
      variant="outlined"
    >
      Create
    </Button>
  );
};
