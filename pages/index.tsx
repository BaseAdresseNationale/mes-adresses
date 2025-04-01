import React, { useContext } from "react";
import dynamic from "next/dynamic";
import {
  Pane,
  Button,
  PlusIcon,
  Spinner,
  SwapHorizontalIcon,
} from "evergreen-ui";
import Link from "next/link";
import Main from "@/layouts/main";
import BALRecoveryContext from "@/contexts/bal-recovery";
import LayoutContext from "@/contexts/layout.tsx";

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
  const { isMobile } = useContext(LayoutContext);
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Main>
      <Pane padding={16} display="flex" justifyContent="flex-end" borderBottom>
        <Button
          iconBefore={SwapHorizontalIcon}
          marginX={8}
          marginY={4}
          onClick={() => {
            setIsRecoveryDisplayed(true);
          }}
        >
          {isMobile ? "Récupérer" : "Récupérer une Base Adresse Locale"}
        </Button>
        <Button
          iconBefore={PlusIcon}
          is={Link}
          marginX={8}
          marginY={4}
          href="/new"
          appearance="primary"
        >
          {isMobile ? "Créer" : "Créer une Base Adresse Locale"}
        </Button>
      </Pane>

      <CSRUserBasesLocales />
    </Main>
  );
}

export default Index;
