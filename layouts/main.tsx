import Footer from "@/components/footer";
import { Pane } from "evergreen-ui";

interface MainProps {
  children: React.ReactNode;
}

function Main({ children }: MainProps) {
  return (
    <Pane display="flex" height="calc(100vh - 76px)" flexDirection="column">
      {children}
      <Footer />
    </Pane>
  );
}

export default Main;
