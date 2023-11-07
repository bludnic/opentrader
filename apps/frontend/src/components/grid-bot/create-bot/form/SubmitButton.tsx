"use client";

import CircularProgress from "@mui/joy/CircularProgress";
import Button from "@mui/joy/Button";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { FC } from "react";
import { tClient } from "src/lib/trpc/client";
import { mapFormToDto } from "./helpers/mapFormToDto";
import { selectBotFormState } from "src/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";

type SubmitButtonProps = {};

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const botFormState = useAppSelector(selectBotFormState);

  const { mutate, isLoading } = tClient.gridBot.create.useMutation({
    onSuccess(bot) {
      enqueueSnackbar("Bot created successfully", {
        variant: "success",
      });

      setTimeout(() => {
        router.push(`/dashboard/grid-bot/details/${bot.id}`);
      }, 3000);
    },
    onError(err) {
      enqueueSnackbar(JSON.stringify(err), {
        variant: "error",
      });
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
