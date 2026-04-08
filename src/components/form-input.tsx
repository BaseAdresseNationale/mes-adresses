import { Pane } from "evergreen-ui";
import React from "react";

interface FormInputProps {
  children: React.ReactNode;
  padding?: number;
  background?: string;
  marginBottom?: number;
}

function FormInput(
  {
    children,
    padding = 8,
    background = "white",
    marginBottom = 8,
  }: FormInputProps,
  ref
) {
  return (
    <Pane
      ref={ref}
      background={background}
      padding={padding}
      borderRadius={8}
      marginBottom={marginBottom}
      width="100%"
    >
      {children}
    </Pane>
  );
}

const forwardedRef = React.forwardRef(FormInput);

export default forwardedRef;
