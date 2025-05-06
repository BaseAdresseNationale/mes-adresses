import {
  Button,
  Pane,
  TextInputField,
  Text,
  Alert,
  Spinner,
} from "evergreen-ui";

interface BALInfosStepProps {
  balName: string;
  setBalName: (name: string) => void;
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  createDemoBAL: () => Promise<void>;
  isLoading?: boolean;
}

function BALInfosStep({
  balName,
  setBalName,
  adminEmail,
  setAdminEmail,
  createDemoBAL,
  isLoading,
}: BALInfosStepProps) {
  return (
    <Pane>
      <Pane maxWidth={600} display="flex" flexDirection="column">
        <TextInputField
          required
          autoComplete="one-time-code"
          name="nom"
          id="nom"
          value={balName}
          label="Nom de la Base Adresse Locale"
          onChange={(e) => setBalName(e.target.value)}
          disabled={isLoading}
        />
        <TextInputField
          required
          type="email"
          name="email"
          id="email"
          value={adminEmail}
          label="Adresse email de l'administrateur"
          placeholder="nom@example.com"
          onChange={(e) => setAdminEmail(e.target.value)}
          disabled={isLoading}
        />
      </Pane>
      <Pane display="flex" flexWrap="wrap" alignItems="center" gap={10}>
        <Text>OU</Text>
        <Button onClick={createDemoBAL} type="button" disabled={isLoading}>
          Créer une Base Adresse Locale de démonstration
        </Button>
      </Pane>
      {isLoading && (
        <>
          <Alert
            title={`Base Adresse Locale en cours de création...`}
            intent="info"
            marginTop={16}
          >
            <Text marginTop={8}>
              Votre Base Adresse Locale est en cours de création. Cette
              opération peut prendre plusieurs minutes.
            </Text>
          </Alert>
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            flex={1}
            marginTop={16}
          >
            <Spinner />
          </Pane>
        </>
      )}
    </Pane>
  );
}

export default BALInfosStep;
