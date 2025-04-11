import { Button, Pane, TextInputField, Text } from "evergreen-ui";

interface BALInfosStepProps {
  balName: string;
  setBalName: (name: string) => void;
  adminEmail: string;
  setAdminEmail: (email: string) => void;
  createDemoBAL: () => Promise<void>;
}

function BALInfosStep({
  balName,
  setBalName,
  adminEmail,
  setAdminEmail,
  createDemoBAL,
}: BALInfosStepProps) {
  return (
    <Pane>
      <TextInputField
        required
        autoComplete="one-time-code"
        name="nom"
        id="nom"
        value={balName}
        maxWidth={600}
        label="Nom de la Base Adresse Locale"
        onChange={(e) => setBalName(e.target.value)}
      />
      <Pane display="flex" alignItems="center">
        <TextInputField
          type="email"
          name="email"
          id="email"
          value={adminEmail}
          maxWidth={400}
          label="Renseignez votre adresse email"
          placeholder="nom@example.com"
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <Text marginX={20}>OU</Text>
        <Button onClick={createDemoBAL}>
          Créer une Base Adresse Locale de démonstration
        </Button>
      </Pane>
    </Pane>
  );
}

export default BALInfosStep;
