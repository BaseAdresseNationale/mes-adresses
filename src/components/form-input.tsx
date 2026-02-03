import { Pane } from "evergreen-ui";
import React from "react";

interface FormInputProps {
  children: React.ReactNode;
  padding?: number;
}

function FormInput({ children, padding = 8 }: FormInputProps, ref) {
  return (
    <Pane
      ref={ref}
      background="white"
      padding={padding}
      borderRadius={8}
      marginBottom={8}
      width="100%"
    >
      {children}
    </Pane>
  );
}

const forwardedRef = React.forwardRef(FormInput);

export default forwardedRef;
