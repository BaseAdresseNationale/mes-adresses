import {
  Button,
  Pane,
  TextInputField,
  Text,
  Alert,
  Spinner,
  Switch,
  Label,
  FormField,
} from "evergreen-ui";
import AdminEmailsField from "@/components/new/steps/admin-emails-field";

interface BALInfosStepProps {
  balName: string;
  setBalName: (name: string) => void;
  adminEmails: string[];
  setAdminEmails: (emails: string[]) => void;
  newEmailInput: string;
  setNewEmailInput: (email: string) => void;
  createDemoBAL: () => Promise<void>;
  isLoading?: boolean;
  isDemoMode: boolean;
  setIsDemoMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function BALInfosStep({
  balName,
  setBalName,
  adminEmails,
  setAdminEmails,
  newEmailInput,
  setNewEmailInput,
  createDemoBAL,
  isLoading,
  isDemoMode,
  setIsDemoMode,
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
        <FormField
          display="flex"
          marginBottom={24}
          label="Créer un Base locale de Demo ?"
          description="Elle ne sera pas sauvegardée."
        >
          <Switch
            marginLeft={8}
            checked={isDemoMode}
            onChange={() => setIsDemoMode(!isDemoMode)}
          />
        </FormField>
        {!isDemoMode ? (
          <AdminEmailsField
            adminEmails={adminEmails}
            setAdminEmails={setAdminEmails}
            newEmailInput={newEmailInput}
            setNewEmailInput={setNewEmailInput}
          />
        ) : (
          ""
        )}
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
