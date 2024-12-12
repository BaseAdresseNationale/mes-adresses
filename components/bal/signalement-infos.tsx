import React from "react";
import { Pane, Heading, Button, Alert } from "evergreen-ui";
import { useRouter } from "next/navigation";

interface SignalementInfosProps {
  balId: string;
  signalementCounts: {
    pending: number;
    archived: number;
  };
}

function SignalementInfos({ balId, signalementCounts }: SignalementInfosProps) {
  const router = useRouter();
  const onClick = () => {
    router.push(`/bal/${balId}/signalements`);
  };

  const signalementBtn = (
    <Button
      type="button"
      onClick={onClick}
      width="fit-content"
      alignSelf="center"
      appearance="primary"
    >
      Consulter les signalements
    </Button>
  );

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
      {signalementCounts.pending > 0 ? (
        <Alert
          intent="info"
          title={
            <Pane fontWeight="normal">
              Vous avez reçu <b>{signalementCounts.pending}</b>{" "}
              {signalementCounts.pending > 1 ? "propositions" : "proposition"}.
            </Pane>
          }
        >
          <Pane marginTop="1rem">{signalementBtn}</Pane>
        </Alert>
      ) : (
        <Pane>{signalementBtn}</Pane>
      )}
    </Pane>
  );
}

export default SignalementInfos;
