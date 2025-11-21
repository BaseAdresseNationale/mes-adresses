import { Pane } from "evergreen-ui";

interface MainProps {
  children: React.ReactNode;
  isEditor?: boolean;
}

function Main({ children, isEditor }: MainProps) {
  return (
    <Pane
      is="main"
      width="100%"
      aria-label="mes-adresses-main"
      display="flex"
      height={isEditor ? "100%" : "calc(100vh - 76px)"}
      flexDirection="column"
    >
      {children}
    </Pane>
  );
}

export default Main;
