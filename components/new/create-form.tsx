import {
  useState,
  useCallback,
  useContext,
  useEffect,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  Ref,
} from "react";
import Router from "next/router";
import { Pane, TextInputField, Checkbox, Button, PlusIcon } from "evergreen-ui";

import { createBaseLocale, populateCommune } from "@/lib/bal-api";

import LocalStorageContext from "@/contexts/local-storage";

import { useCheckboxInput } from "@/hooks/input";
import useError from "@/hooks/error";

import FormContainer from "@/components/form-container";
import FormInput from "@/components/form-input";
import CommuneSearchField from "@/components/commune-search/commune-search-field";
import AlertOtherBal from "@/components/new/alert-other-bal";
import { CommuneApiGeoType } from "@/lib/geo-api/type";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  PageBaseLocaleDTO,
} from "@/lib/openapi";

interface CreateFormProps {
  namePlaceholder: string;
  commune: CommuneApiGeoType;
  handleCommune: Dispatch<SetStateAction<CommuneApiGeoType>>;
  nom: string;
  onNomChange: ChangeEventHandler<HTMLInputElement>;
  email: string;
  onEmailChange: ChangeEventHandler<HTMLInputElement>;
}

function CreateForm({
  namePlaceholder,
  commune,
  handleCommune,
  nom,
  onNomChange,
  email,
  onEmailChange,
}: CreateFormProps) {
  const { addBalAccess } = useContext(LocalStorageContext);

  const [isLoading, setIsLoading] = useState(false);
  const [populate, onPopulateChange] = useCheckboxInput(true);
  const [isShown, setIsShown] = useState(false);
  const [userBALs, setUserBALs] = useState<ExtendedBaseLocaleDTO[]>([]);
  const [ref, setRef] = useState<HTMLInputElement>();
  const [setError] = useError(null);

  useEffect(() => {
    if (ref) {
      ref.focus();
    }
  }, [ref]);

  const createNewBal = useCallback(async () => {
    if (commune) {
      const bal = await createBaseLocale({
        nom,
        emails: [email],
        commune: commune.code,
      });

      addBalAccess(bal._id, bal.token);

      if (populate) {
        await populateCommune(bal._id, bal.token);
      }

      Router.push(`/bal/${bal._id}`);
    }
  }, [email, nom, populate, commune, addBalAccess]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await checkUserBALs();
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const checkUserBALs = async () => {
    const response: PageBaseLocaleDTO =
      await BasesLocalesService.searchBaseLocale(
        10,
        0,
        false,
        commune.code,
        email
      );

    if (response.results.length > 0) {
      setUserBALs(response.results);
      setIsShown(true);
    } else {
      createNewBal();
    }
  };

  const onCancel = () => {
    setIsShown(false);
    setIsLoading(false);
  };

  return (
    <Pane overflowY="scroll" marginY={32}>
      <FormContainer onSubmit={onSubmit}>
        {userBALs.length > 0 && (
          <AlertOtherBal
            isShown={isShown}
            userEmail={email}
            basesLocales={userBALs}
            updateBAL={() => checkUserBALs()}
            onConfirm={createNewBal}
            onClose={() => onCancel()}
          />
        )}

        <FormInput>
          <CommuneSearchField
            required
            innerRef={setRef}
            id="commune"
            initialSelectedItem={commune}
            label="Commune"
            hint="Pour affiner la recherche, renseignez le code département"
            placeholder="Roche 42"
            appearance="default"
            maxWidth={500}
            disabled={isLoading}
            onSelect={handleCommune}
          />

          <Checkbox
            label="Importer les voies et numéros depuis la BAN"
            checked={populate}
            disabled={isLoading}
            marginBottom={0}
            onChange={onPopulateChange}
          />
        </FormInput>

        <FormInput>
          <TextInputField
            required
            autoComplete="new-password" // Hack to bypass chrome autocomplete
            name="nom"
            id="nom"
            value={nom}
            maxWidth={600}
            marginBottom={0}
            disabled={isLoading}
            label="Nom de la Base Adresse Locale"
            placeholder={namePlaceholder}
            onChange={onNomChange}
          />
        </FormInput>

        <FormInput>
          <TextInputField
            required
            type="email"
            name="email"
            id="email"
            value={email}
            maxWidth={400}
            marginBottom={0}
            disabled={isLoading}
            label="Votre adresse email"
            placeholder="nom@example.com"
            onChange={onEmailChange}
          />
        </FormInput>

        <Button
          height={40}
          marginTop={8}
          type="submit"
          appearance="primary"
          intent="success"
          isLoading={isLoading}
          iconAfter={isLoading ? null : PlusIcon}
        >
          {isLoading ? "En cours de création…" : "Créer la Base Adresse Locale"}
        </Button>
      </FormContainer>
    </Pane>
  );
}

export default CreateForm;
