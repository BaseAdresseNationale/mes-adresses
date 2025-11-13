import React, { useMemo, useState } from "react";
import {
  Pane,
  TextInput,
  IconButton,
  Label,
  AddIcon,
  TrashIcon,
} from "evergreen-ui";
import { validateEmail } from "@/lib/utils/email";

interface BALAdminEmailsProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function BALAdminEmails({ value, onChange }: BALAdminEmailsProps) {
  const [newEmailInput, setNewEmailInput] = useState("");

  const canAddEmail = useMemo(() => {
    return (
      newEmailInput &&
      !value.includes(newEmailInput) &&
      validateEmail(newEmailInput)
    );
  }, [newEmailInput, value]);

  const onSubmitNewEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (canAddEmail) {
      onChange([...value, newEmailInput]);
      setNewEmailInput("");
    }
  };

  const onRemoveEmail = (emailToRemove: string) => {
    onChange(value.filter((e) => e !== emailToRemove));
  };

  return (
    <Pane>
      <Label display="block" marginBottom={8}>
        Accès administrateur
      </Label>
      {value.map((email) => (
        <Pane key={email} display="flex" marginBottom={8}>
          <TextInput
            readOnly
            disabled
            type="email"
            display="block"
            width="100%"
            maxWidth={400}
            value={email}
          />
          <IconButton
            type="button"
            icon={TrashIcon}
            marginLeft={4}
            appearance="minimal"
            intent="danger"
            onClick={() => onRemoveEmail(email)}
            disabled={value.length === 1}
          />
        </Pane>
      ))}

      <Pane display="flex" marginBottom={0}>
        <TextInput
          display="block"
          type="email"
          pattern=""
          width="100%"
          placeholder="Ajouter une adresse email…"
          maxWidth={400}
          value={newEmailInput}
          onChange={(e) => setNewEmailInput(e.target.value)}
        />
        <IconButton
          type="button"
          icon={AddIcon}
          marginLeft={4}
          appearance="primary"
          intent="success"
          onClick={onSubmitNewEmail}
          disabled={!canAddEmail}
        />
      </Pane>
    </Pane>
  );
}
