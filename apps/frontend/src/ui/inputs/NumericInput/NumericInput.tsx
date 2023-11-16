import { forwardRef } from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumericInputProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  NumericFormatProps?: NumericFormatProps;
}

export const NumericInput = forwardRef<
  NumericFormatProps,
  NumericInputProps
>(function NumericInput(props, ref) {
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
});
