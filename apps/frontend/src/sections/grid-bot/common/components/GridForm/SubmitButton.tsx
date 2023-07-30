import { Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import React, { FC, useEffect } from 'react';
import { mapFormToDto } from 'src/sections/grid-bot/common/components/GridForm/helpers/mapFormToDto';
import { selectBotFormState } from 'src/sections/grid-bot/create-bot/store/bot-form/selectors';
import { createGridBot } from 'src/sections/grid-bot/create-bot/store/create-bot';
import { selectCreateGridBotState } from 'src/sections/grid-bot/create-bot/store/create-bot/selectors';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { FetchStatus } from 'src/utils/redux/types';

const componentName = "SubmitButton";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(Button)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type SubmitButtonProps = {
  className?: string;
};

export const SubmitButton: FC<SubmitButtonProps> = (props) => {
  const { className } = props;
  const { enqueueSnackbar } = useSnackbar();

  const botFormState = useAppSelector(selectBotFormState);
  const { bot, status, err } = useAppSelector(selectCreateGridBotState);

  const dispatch = useAppDispatch();

  const submitting = status === FetchStatus.Loading;

  const handleSubmit = () => {
    const dto = mapFormToDto(botFormState);

    dispatch(createGridBot(dto));
  };

  useEffect(() => {
    if (status === FetchStatus.Succeeded) {
      enqueueSnackbar("Bot created successfully", {
        variant: "success",
      });
    } else if (status === FetchStatus.Error) {
      enqueueSnackbar(JSON.stringify(err), {
        variant: "error",
      });
      console.log(err);
    }
  }, [
    status
  ])

  return (
    <Root
      className={clsx(classes.root, className)}
      variant="outlined"
      color="primary"
      type="submit"
      disabled={submitting}
      startIcon={submitting ? <CircularProgress size={18} /> : null}
      onClick={handleSubmit}
    >
      Create
    </Root>
  );
};
