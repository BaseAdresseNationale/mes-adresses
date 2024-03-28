import { Alert, Button, Pane } from "evergreen-ui";

interface SignalementCardProps {
  onAccept: () => void;
  onRefuse: () => void;
  children: React.ReactNode;
}

function SignalementCard({
  onAccept,
  onRefuse,
  children,
}: SignalementCardProps) {
  return (
    <Alert
      intent="warning"
      hasIcon={false}
      marginTop={10}
      title="Modification demandée : "
    >
      <Pane display="flex" flexDirection="column" marginTop={10}>
        {children}
        <Pane marginTop={10}>
          <Button
            onClick={onAccept}
            appearance="primary"
            type="button"
            marginRight={10}
          >
            Accepter
          </Button>
          <Button onClick={onRefuse} type="button">
            Refuser
          </Button>
        </Pane>
      </Pane>
    </Alert>
  );
}

export default SignalementCard;
