import { useState } from "react";
import { Alert, Button, Text } from "evergreen-ui";

import RecoverBALAlert from "@/components/bal-recovery/recover-bal-alert";

function BALRecovery() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <RecoverBALAlert
        isShown={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <Alert>
        <Text>
          Vous ne retrouvez pas vos Bases Adresse Locales ? Pour les récupérer
          par courriel
        </Text>
        <Button
          appearance="primary"
          marginLeft="1em"
          onClick={() => setIsDialogOpen(true)}
        >
          Cliquez ici
        </Button>
      </Alert>
    </>
  );
}

export default BALRecovery;
