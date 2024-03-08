import { Pane } from "evergreen-ui";
import React from "react";

interface FormInputProps {
  children: React.ReactNode;
}

function FormInput({ children }: FormInputProps, ref) {
  return (
    <Pane
      ref={ref}
      background="white"
      padding={8}
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
