import { Pane, PaneProps } from "evergreen-ui";

function FormContainer({ children, ...props }: PaneProps) {
  return (
    <Pane
      is="form"
      background="gray300"
      flex={1}
      padding={12}
      height="auto"
      {...props}
    >
      {children}
    </Pane>
  );
}

export default FormContainer;
