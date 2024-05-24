import React from "react";
import { Pane, Heading, Button, Alert } from "evergreen-ui";
import { Signalement } from "@/lib/openapi-signalement";
import { useRouter } from "next/navigation";

interface SignalementInfosProps {
  balId: string;
  signalements: Signalement[];
}

function SignalementInfos({ balId, signalements }: SignalementInfosProps) {
  const router = useRouter();
  const onClick = () => {
    router.push(`/bal/${balId}/signalements`);
  };

  return (
    <Pane
      display="flex"
      flexDirection="column"
      backgroundColor="white"
      padding={8}
      borderRadius={10}
      margin={8}
    >
      <Heading marginBottom={15}>Signalements</Heading>
      <Alert
        intent="info"
        title={
          <Pane fontWeight="normal">
            Vous avez reçu <b>{signalements.length}</b>{" "}
            {signalements.length > 1 ? "propositions" : "proposition"}.
          </Pane>
        }
      >
        <Button
          marginTop="1rem"
          type="button"
          onClick={onClick}
          width="fit-content"
          alignSelf="center"
          appearance="primary"
        >
          Consulter les signalements
        </Button>
      </Alert>
    </Pane>
  );
}

export default SignalementInfos;
