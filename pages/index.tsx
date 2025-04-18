import React, { useContext, useEffect } from "react";
import dynamic from "next/dynamic";
import { Pane, Spinner } from "evergreen-ui";
import Main from "@/layouts/main";
import BALWidgetContext from "@/contexts/bal-widget.tsx";
import Footer from "@/components/footer.tsx";

const CSRUserBasesLocales = dynamic(
  () => import("../components/user-bases-locales.tsx") as any,
  {
    ssr: false,
    loading: () => (
      <Pane
        height="100%"
        display="flex"
        flex={1}
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Pane>
    ),
  }
);

function Index() {
  const { showWidget, hideWidget } = useContext(BALWidgetContext);

  useEffect(() => {
    showWidget();
    return () => {
      hideWidget();
    };
  }, [showWidget, hideWidget]);

  return (
    <Main>
      <CSRUserBasesLocales />
      <Footer />
    </Main>
  );
}

export default Index;
