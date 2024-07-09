import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Pane,
  TextInputField,
  TextInput,
  IconButton,
  Button,
  Alert,
  Label,
  DeleteIcon,
  AddIcon,
} from "evergreen-ui";
import { isEqual, difference } from "lodash";

import { validateEmail } from "@/lib/utils/email";

import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";

import { useInput } from "@/hooks/input";

import FormContainer from "@/components/form-container";
import FormInput from "@/components/form-input";
import RenewTokenDialog from "@/components/renew-token-dialog";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi";
import LayoutContext from "@/contexts/layout";

const mailHasChanged = (listA, listB) => {
  return !isEqual(
    [...listA].sort((a, b) => a.localeCompare(b)),
    [...listB].sort((a, b) => a.localeCompare(b))
  );
};

interface BALSettingsFormProps {
  baseLocale: BaseLocale;
}

const BALSettingsForm = React.memo(function BALSettingsForm({
  baseLocale,
}: BALSettingsFormProps) {
  const { token, emails, reloadEmails } = useContext(TokenContext);
  const { reloadBaseLocale } = useContext(BalDataContext);

  const [isLoading, setIsLoading] = useState(false);
  const [balEmails, setBalEmails] = useState([]);
  const [nomInput, onNomInputChange] = useInput(baseLocale.nom);
  const [email, onEmailChange, resetEmail] = useInput();
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState("");
  const [isRenewTokenWarningShown, setIsRenewTokenWarningShown] =
    useState(false);
  const { pushToast } = useContext(LayoutContext);

  const formHasChanged = useCallback(() => {
    return (
      nomInput !== baseLocale.nom || mailHasChanged(emails || [], balEmails)
    );
  }, [nomInput, baseLocale.nom, emails, balEmails]);

  useEffect(() => {
    setBalEmails(emails || []);
  }, [emails]);

  const onRemoveEmail = useCallback((email) => {
    setBalEmails((emails) => emails.filter((e) => e !== email));
  }, []);

  const onAddEmail = useCallback(
    (e) => {
      e.preventDefault();

      if (validateEmail(email)) {
        setBalEmails((emails) => [...emails, email]);
        resetEmail();
      } else {
        setError("Cet email n’est pas valide");
      }
    },
    [email, resetEmail]
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setError(null);
      setIsLoading(true);

      try {
        await BasesLocalesService.updateBaseLocale(baseLocale._id, {
          nom: nomInput.trim(),
          emails: balEmails,
        });

        await reloadEmails();
        await reloadBaseLocale();

        if (
          mailHasChanged(emails || [], balEmails) &&
          difference(emails, balEmails).length > 0
        ) {
          setIsRenewTokenWarningShown(true);
        }

        pushToast({
          title: "La Base Adresse Locale a été modifiée avec succès !",
          intent: "success",
        });
      } catch (error) {
        setError(error.body?.message);
      }

      setIsLoading(false);
    },
    [
      baseLocale._id,
      nomInput,
      balEmails,
      token,
      reloadEmails,
      reloadBaseLocale,
      emails,
      pushToast,
    ]
  );

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setHasChanges(formHasChanged());
  }, [formHasChanged]);

  return (
    <FormContainer onSubmit={onSubmit} display="flex" flexDirection="column">
      <Pane>
        <FormInput>
          <TextInputField
            required
            name="nom"
            id="nom"
            value={nomInput}
            maxWidth={600}
            marginBottom={0}
            disabled={isLoading || baseLocale.status === "demo"}
            label="Nom"
            placeholder="Nom"
            onChange={onNomInputChange}
          />
        </FormInput>

        <FormInput>
          <Label display="block" marginBottom={4}>
            Adresses email <span title="This field is required.">*</span>
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
        {error && (
          <Alert marginBottom={16} intent="danger" title="Erreur">
            {error}
          </Alert>
        )}

        {isRenewTokenWarningShown && (
          <RenewTokenDialog
            baseLocaleId={baseLocale._id}
            isShown={isRenewTokenWarningShown}
            setIsShown={setIsRenewTokenWarningShown}
            setError={setError}
          />
        )}
      </Pane>

      <Button
        height={40}
        marginTop={8}
        type="submit"
        appearance="primary"
        disabled={!hasChanges}
        isLoading={isLoading}
        width="fit-content"
      >
        {isLoading ? "En cours…" : "Enregistrer les changements"}
      </Button>
    </FormContainer>
  );
});

export default BALSettingsForm;
