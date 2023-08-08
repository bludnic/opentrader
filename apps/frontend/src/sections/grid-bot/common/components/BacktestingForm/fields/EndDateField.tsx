import React, { FC } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { parseISO } from "date-fns";
import ruLocale from "date-fns/locale/ru";

import { useAppDispatch, useAppSelector } from "src/store/hooks";
import {
  changeEndDate,
  selectEndDate,
} from "src/sections/grid-bot/create-bot/store/backtesting-form";
import { formatDateISO } from "src/utils/date/formatDateISO";

type EndDateFieldProps = {
  className?: string;
};

export const EndDateField: FC<EndDateFieldProps> = (props) => {
  const { className } = props;

  const dispatch = useAppDispatch();

  const selectedDate = useAppSelector(selectEndDate);
  const value = selectedDate ? parseISO(selectedDate) : null;

  const handleChange = (newDate: Date | null) => {
    const newValue = newDate ? formatDateISO(newDate) : null;

    dispatch(changeEndDate(newValue));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
      <DatePicker
        className={className}
        value={value}
        onChange={handleChange}
        label="End date"
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};
