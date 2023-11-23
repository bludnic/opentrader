"use client";

import CircularProgress from "@mui/joy/CircularProgress";
import Button from "@mui/joy/Button";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { tClient } from "src/lib/trpc/client";
import { mapFormToDto } from "./helpers/mapFormToDto";
import { selectBotFormState } from "src/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";
import { useSnackbar } from "src/ui/snackbar";

type SubmitButtonProps = {};

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const botFormState = useAppSelector(selectBotFormState);

  const { mutate, isLoading } = tClient.gridBot.create.useMutation({
    onSuccess(bot) {
      showSnackbar("Bot created successfully");

      setTimeout(() => {
        router.push(`/dashboard/grid-bot/${bot.id}`);
      }, 1000);
    },
  });

  const handleSubmit = () => {
    const dto = mapFormToDto(botFormState);

    mutate(dto);
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      type="submit"
      disabled={isLoading}
      startDecorator={isLoading ? <CircularProgress size="md" /> : null}
      onClick={handleSubmit}
    >
      Create
    </Button>
  );
};
