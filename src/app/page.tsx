"use client";

import dynamic from "next/dynamic";
import { Pane, Spinner } from "evergreen-ui";
import Footer from "@/components/footer";

const CSRUserBasesLocales = dynamic(
  () => import("../components/user-bases-locales"),
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
  return (
    <>
      <CSRUserBasesLocales />
      <Footer />
    </>
  );
}

export default Index;
