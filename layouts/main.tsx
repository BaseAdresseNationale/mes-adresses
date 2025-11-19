import { Pane } from "evergreen-ui";

interface MainProps {
  children: React.ReactNode;
}

function Main({ children }: MainProps) {
  return (
    <Pane
      is="main"
      aria-label="mes-adresses-main"
      display="flex"
      height="calc(100vh - 76px)"
      flexDirection="column"
    >
      {children}
    </Pane>
  );
}

export default Main;
