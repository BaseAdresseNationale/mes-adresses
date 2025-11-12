import React from "react";
import {
  Pane,
  TextInput,
  IconButton,
  Label,
  DeleteIcon,
  AddIcon,
} from "evergreen-ui";
import FormInput from "@/components/form-input";
import { BaseLocale } from "@/lib/openapi-api-bal";

interface BALSettingsFormProps {
  balEmails: string[];
  onRemoveEmail: (email: string) => void;
  onAddEmail: () => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
  error: string;
  baseLocale: BaseLocale;
}

const BALSettingsForm = React.memo(function BALSettingsForm({
  balEmails,
  onRemoveEmail,
  onAddEmail,
  onEmailChange,
  email,
  error,
  baseLocale,
}: BALSettingsFormProps) {
  return (
    <FormInput padding={0}>
      <Label display="block" marginBottom={4}>
        Administrateurs <span title="This field is required.">*</span>
      </Label>
      {balEmails.map((email) => (
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
          {balEmails.length > 1 && (
            <IconButton
              type="button"
              icon={DeleteIcon}
              marginLeft={4}
              appearance="minimal"
              intent="danger"
              onClick={() => onRemoveEmail(email)}
            />
          )}
        </Pane>
      ))}

      <Pane display="flex" marginBottom={0}>
        <TextInput
          display="block"
          type="email"
          width="100%"
          placeholder="Ajouter une adresse email…"
          maxWidth={400}
          isInvalid={Boolean(error && error.includes("mail"))}
          value={email}
          disabled={baseLocale.status === "demo"}
          onChange={onEmailChange}
        />

        {email && !balEmails.includes(email) && (
          <IconButton
            type="submit"
            icon={AddIcon}
            marginLeft={4}
            disabled={!email}
            appearance="minimal"
            intent="default"
            onClick={onAddEmail}
          />
        )}
      </Pane>
    </FormInput>
  );
});

export default BALSettingsForm;
