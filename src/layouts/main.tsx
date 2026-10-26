"use client";

import { useState } from "react";
import Header from "@/components/header";
import { Pane } from "evergreen-ui";
import IEWarning from "@/components/ie-warning";
import AlertBanner from "@/components/alert-banner";

interface MainProps {
  children: React.ReactNode;
}

function Main({ children }: MainProps) {
  const [alertBannerHeight, setAlertBannerHeight] = useState(0);

  return (
    <Pane
      height="100%"
      width="100%"
      display="flex"
      flexDirection="column"
      backgroundColor="white"
    >
      <AlertBanner onHeightChange={setAlertBannerHeight} />
      <Header />
      <>
        <IEWarning />
        <Pane
          is="main"
          width="100%"
          aria-label="mes-adresses-main"
          display="flex"
          height={`calc(100vh - 76px - ${alertBannerHeight}px)`}
          flexDirection="column"
        >
          {children}
        </Pane>
      </>
    </Pane>
  );
}

export default Main;
