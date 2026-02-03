import {
  Button,
  Pane,
  TextInputField,
  Text,
  Alert,
  Spinner,
  Label,
  IconButton,
  TextInput,
  TrashIcon,
  AddIcon,
} from "evergreen-ui";
import FormInput from "@/components/form-input";
import { useMemo, useState } from "react";
import { validateEmail } from "@/lib/utils/email";

interface BALInfosStepProps {
  balName: string;
  setBalName: (name: string) => void;
  adminEmails: string[];
  setAdminEmails: (emails: string[]) => void;
  createDemoBAL: () => Promise<void>;
  isLoading?: boolean;
}

function BALInfosStep({
  balName,
  setBalName,
  adminEmails,
  setAdminEmails,
  createDemoBAL,
  isLoading,
}: BALInfosStepProps) {
  const [newEmailInput, setNewEmailInput] = useState("");

  const canAddEmail = useMemo(() => {
    return (
      newEmailInput &&
      !adminEmails.includes(newEmailInput) &&
      validateEmail(newEmailInput)
    );
  }, [newEmailInput, adminEmails]);

  const onSubmitNewEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (canAddEmail) {
      setAdminEmails([...adminEmails, newEmailInput]);
      setNewEmailInput("");
    }
  };

  const onRemoveEmail = (emailToRemove: string) => {
    setAdminEmails(adminEmails.filter((e) => e !== emailToRemove));
  };

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
        <FormInput padding={0}>
          <Pane marginBottom={8}>
            <Label>Adresses emails de des administrateurs *</Label>
          </Pane>
          {adminEmails.map((email, index) => (
            <Pane
              key={`form-admin-emails-${index}`}
              display="flex"
              marginBottom={8}
            >
              <TextInput readOnly type="email" value={adminEmails[index]} />
              <IconButton
                type="button"
                icon={TrashIcon}
                marginLeft={4}
                appearance="minimal"
                intent="danger"
                onClick={() => onRemoveEmail(email)}
                disabled={adminEmails.length === 1}
              />
            </Pane>
          ))}
          <Pane display="flex" marginBottom={16}>
            <TextInput
              display="block"
              type="email"
              width="100%"
              placeholder="Ajouter une adresse email…"
              maxWidth={400}
              value={newEmailInput}
              onChange={(e) => setNewEmailInput(e.target.value)}
            />
            <IconButton
              type="button"
              title="Ajouter"
              icon={AddIcon}
              marginLeft={4}
              appearance="primary"
              intent="success"
              onClick={onSubmitNewEmail}
              disabled={!canAddEmail}
            />
          </Pane>
        </FormInput>
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
