import React, { useContext } from "react";
import dynamic from "next/dynamic";
import {
  Pane,
  Button,
  PlusIcon,
  Spinner,
  Alert,
  Text,
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
      <Pane padding={16} display="flex" justifyContent="flex-end">
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

      <Alert margin={16} hasIcon={false}>
        <Pane
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
        >
          <Text is="p" textAlign="center">
            Vous voulez simplement essayer l’éditeur sans créer de Base Adresse
            Locale ?
          </Text>
          <Button appearance="primary" is={Link} href="/new?demo=1">
            Cliquer ici
          </Button>
        </Pane>
      </Alert>
    </Main>
  );
}

export default Index;
