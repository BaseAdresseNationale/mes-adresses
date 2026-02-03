"use client";

import { useContext } from "react";
import { Alert, Button, Text } from "evergreen-ui";
import BALRecoveryContext from "@/contexts/bal-recovery";

function BALRecovery() {
  const { setIsRecoveryDisplayed } = useContext(BALRecoveryContext);

  return (
    <Alert>
      <Text>
        Vous ne retrouvez pas vos Bases Adresse Locales ? Pour les récupérer par
        courriel
      </Text>
      <Button
        appearance="primary"
        marginLeft="1em"
        onClick={() => setIsRecoveryDisplayed(true)}
      >
        Cliquez ici
      </Button>
    </Alert>
  );
}

export default BALRecovery;
