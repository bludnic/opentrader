import React, { FC } from "react";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { SubmitButton } from "./SubmitButton";
import { selectFormType } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";
import { AdvancedGridForm } from "./AdvancedGridForm";
import { ExchangeAccountField } from "./fields/ExchangeAccountField";
import { InvestmentField } from "./fields/InvestmentField";
import { PairField } from "./fields/PairField";
import { FormTypeField } from "./fields/FormTypeField";
import { SimpleGridForm } from "./SimpleGridForm";

const componentName = "CreateGridBotForm";
const classes = {
  root: `${componentName}-root`,
  field: `${componentName}-field`,
};
const Root = styled("div")(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`& .${classes.field}`]: {
    marginTop: 16,
  },
}));

type CreateGridBotFormProps = {
  className?: string;
};

export const CreateGridBotForm: FC<CreateGridBotFormProps> = (props) => {
  const { className } = props;

  const formType = useAppSelector(selectFormType);

  return (
    <Root className={clsx(classes.root, className)}>
      <Grid container mb={6}>
        <Grid item xs={12}>
          <FormTypeField />
        </Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item md={6} xs={12}>
          <ExchangeAccountField />
        </Grid>

        <Grid item md={6} xs={12}>
          <PairField />
        </Grid>

        <Grid item xs={12}>
          <InvestmentField />
        </Grid>
      </Grid>

      {formType === "simple" ? <SimpleGridForm /> : <AdvancedGridForm />}

      <Grid container item xs={12} mt={2}>
        <Grid item xs={12}>
          <SubmitButton />
        </Grid>
      </Grid>
    </Root>
  );
};
