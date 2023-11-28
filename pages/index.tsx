import React, { useContext } from "react";
import dynamic from "next/dynamic";
import {
  Pane,
  Button,
  Heading,
  PlusIcon,
  Spinner,
  Alert,
  Text,
  SwapHorizontalIcon,
} from "evergreen-ui";
import Link from "next/link";
import Main from "@/layouts/main";
import useWindowSize from "@/hooks/useWindowSize";
import BALRecoveryContext from "@/contexts/bal-recovery";

const CSRUserBasesLocales = dynamic(
  () => import("../components/user-bases-locales.js") as any,
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
  const { isMobile } = useWindowSize();
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Main>
      <Heading
        padding={16}
        size={400}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexShrink="0"
      >
        Mes Bases Adresse Locales
        <Pane>
          <Button
            iconBefore={SwapHorizontalIcon}
            marginX={8}
            marginY={4}
            onClick={() => {
              setIsRecoveryDisplayed(true);
            }}
          >
            {isMobile ? "Récupérer une Base Adresse Locale" : "Récupérer"}
          </Button>
          <Button
            iconBefore={PlusIcon}
            is={Link}
            marginX={8}
            marginY={4}
            href="/new"
            appearance="primary"
          >
            {isMobile ? "Créer une Base Adresse Locale" : "Créer"}
          </Button>
        </Pane>
      </Heading>

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
