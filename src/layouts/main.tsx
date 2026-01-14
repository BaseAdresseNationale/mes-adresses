"use client";

import Header from "@/components/header";
import { Pane } from "evergreen-ui";
import IEWarning from "@/components/ie-warning";

interface MainProps {
  children: React.ReactNode;
  isEditor?: boolean;
}

function Main({ children, isEditor }: MainProps) {
  return (
    <Pane height="100%" width="100%" display="flex" flexDirection="column">
      <Header />
      <>
        <IEWarning />
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
      </>
    </Pane>
  );
}

export default Main;
