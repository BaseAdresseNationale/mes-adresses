import React from "react";
import { Pane, Heading, Button, Alert, Text } from "evergreen-ui";
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
          hasIcon={false}
          title={
            <Text is="p" marginTop={0}>
              Des administrés ou des services publics ont proposé{" "}
              <b>{signalementCounts.pending}</b>{" "}
              {`amélioration${signalementCounts.pending > 1 ? "s" : ""}`} sur
              les adresses de votre commune.
            </Text>
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
