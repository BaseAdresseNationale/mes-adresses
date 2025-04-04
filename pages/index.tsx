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
      <Pane
        padding={16}
        display="flex"
        justifyContent="space-between"
        borderBottom
        flexWrap="wrap"
        gap={8}
      >
        <Pane
          id="bal-list-controls"
          display="flex"
          flexWrap="wrap"
          gap={8}
          alignItems="center"
          order={isMobile ? 1 : 0}
        />

        <Pane display="flex" gap={8} flexWrap="wrap" order={isMobile ? 0 : 1}>
          <Button
            iconBefore={SwapHorizontalIcon}
            onClick={() => {
              setIsRecoveryDisplayed(true);
            }}
          >
            {isMobile ? "Récupérer" : "Récupérer une Base Adresse Locale"}
          </Button>
          <Button
            iconBefore={PlusIcon}
            is={Link}
            href="/new"
            appearance="primary"
          >
            {isMobile ? "Créer" : "Créer une Base Adresse Locale"}
          </Button>
        </Pane>
      </Pane>

      <CSRUserBasesLocales />
    </Main>
  );
}

export default Index;
