import { forwardRef } from "react";
import type { NumericFormatProps } from "react-number-format";
import { NumericFormat } from "react-number-format";

type NumericInputProps = {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  NumericFormatProps?: NumericFormatProps;
};

export const NumericInput = forwardRef<NumericFormatProps, NumericInputProps>(
  function NumericInput(props, ref) {
    const { onChange, NumericFormatProps, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        {...NumericFormatProps}
      />
    );
  },
);
