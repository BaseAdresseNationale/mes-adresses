import {
  IconButton,
  Label,
  Pane,
  TextInput,
  TrashIcon,
  AddIcon,
} from "evergreen-ui";
import { useMemo } from "react";
import { validateEmail } from "@/lib/utils/email";
import FormInput from "@/components/form-input";

interface AdminEmailsFieldProps {
  adminEmails: string[];
  setAdminEmails: (emails: string[]) => void;
  newEmailInput: string;
  setNewEmailInput: (email: string) => void;
  label?: string;
  background?: string;
}

function AdminEmailsField({
  adminEmails,
  setAdminEmails,
  newEmailInput,
  setNewEmailInput,
  background = "white",
}: AdminEmailsFieldProps) {
  const canAddEmail = useMemo(() => {
    return (
      newEmailInput &&
      !adminEmails.includes(newEmailInput) &&
      validateEmail(newEmailInput)
    );
  }, [newEmailInput, adminEmails]);

  const onAddEmail = () => {
    if (canAddEmail) {
      setAdminEmails([...adminEmails, newEmailInput]);
      setNewEmailInput("");
    }
  };

  const onRemoveEmail = (emailToRemove: string) => {
    setAdminEmails(adminEmails.filter((e) => e !== emailToRemove));
  };

  return (
    <FormInput padding={0} background={background} marginBottom={0}>
      <Pane marginBottom={8}>
        <Label>Adresses emails des administrateurs *</Label>
      </Pane>
      {adminEmails.map((email, index) => (
        <Pane
          key={`form-admin-emails-${index}`}
          display="flex"
          marginBottom={8}
        >
          <TextInput readOnly type="email" value={email} />
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
      <Pane display="flex">
        <TextInput
          display="block"
          type="email"
          width="100%"
          placeholder="Ajouter une adresse email…"
          maxWidth={400}
          value={newEmailInput}
          isInvalid={newEmailInput.length > 0 && !validateEmail(newEmailInput)}
          onChange={(e) => setNewEmailInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddEmail();
            }
          }}
        />
        <IconButton
          type="button"
          title="Ajouter"
          icon={AddIcon}
          marginLeft={4}
          appearance="primary"
          intent="success"
          onClick={onAddEmail}
          disabled={!canAddEmail}
        />
      </Pane>
    </FormInput>
  );
}

export default AdminEmailsField;
