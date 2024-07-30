import {
  useState,
  useCallback,
  useContext,
  useEffect,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
} from "react";
import Router from "next/router";
import { Pane, TextInputField, Checkbox, Button, PlusIcon } from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";

import { useCheckboxInput } from "@/hooks/input";

import FormContainer from "@/components/form-container";
import FormInput from "@/components/form-input";
import CommuneSearchField from "@/components/commune-search/commune-search-field";
import AlertOtherBal from "@/components/new/alert-other-bal";
import AlertPublishedBal from "@/components/new/alert-published-bal";
import { CommuneApiGeoType } from "@/lib/geo-api/type";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  OpenAPI,
  PageBaseLocaleDTO,
} from "@/lib/openapi";
import { ApiDepotService } from "@/lib/api-depot";
import { Client, Revision } from "@/lib/api-depot/types";
import LayoutContext from "@/contexts/layout";

export enum ClientRevisionEnum {
  API_DEPOT = "api-depot",
  FORMULAIRE_PUBLICATION = "formulaire-publication",
  GUICHET_ADRESSES = "guichet-adresse",
  MES_ADRESSES = "mes-adresses",
  MOISSONNEUR_BAL = "moissonneur-bal",
}

export function isExceptionClientId(
  revision: Revision,
  outdatedApiDepotClients: string[],
  outdatedHarvestSources: string[]
) {
  const client: Client = revision.client as Client;
  if (client.id === ClientRevisionEnum.MOISSONNEUR_BAL) {
    const sourceId: string = revision.context.extras.sourceId;
    if (sourceId && outdatedHarvestSources) {
      if (outdatedHarvestSources.includes(sourceId)) {
        return true;
      }
    }
  } else {
    if (outdatedApiDepotClients.includes(client.id)) {
      return true;
    }
  }

  return false;
}

interface CreateFormProps {
  namePlaceholder: string;
  commune: CommuneApiGeoType;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
  handleCommune: Dispatch<SetStateAction<CommuneApiGeoType>>;
  nom: string;
  onNomChange: ChangeEventHandler<HTMLInputElement>;
  email: string;
  onEmailChange: ChangeEventHandler<HTMLInputElement>;
}

function CreateForm({
  namePlaceholder,
  commune,
  outdatedApiDepotClients,
  outdatedHarvestSources,
  handleCommune,
  nom,
  onNomChange,
  email,
  onEmailChange,
}: CreateFormProps) {
  const { addBalAccess } = useContext(LocalStorageContext);
  const { pushToast } = useContext(LayoutContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [populate, onPopulateChange] = useCheckboxInput(true);
  const [isShownAlertOtherBal, setIsShownAlertOtherBal] =
    useState<boolean>(false);
  const [isShownAlertPublishedBal, setIsShownAlertPublishedBal] =
    useState<boolean>(false);
  const [userBALs, setUserBALs] = useState<ExtendedBaseLocaleDTO[]>([]);
  const [publishedRevision, setPublishedRevision] = useState<Revision>(null);
  const [ref, setRef] = useState<HTMLInputElement>();

  useEffect(() => {
    if (ref) {
      ref.focus();
    }
  }, [ref]);

  const createNewBal = useCallback(async () => {
    if (commune) {
      const bal = await BasesLocalesService.createBaseLocale({
        nom,
        emails: [email],
        commune: commune.code,
      });

      addBalAccess(bal.id, bal.token);

      if (populate) {
        Object.assign(OpenAPI, { TOKEN: bal.token });
        await BasesLocalesService.populateBaseLocale(bal.id);
      }

      Router.push(`/bal/${bal.id}`);
    }
  }, [email, nom, populate, commune, addBalAccess]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // CHECK OTHER BAL PUBLISH
    try {
      const revision: Revision = await ApiDepotService.getCurrentRevision(
        commune.code
      );
      if (
        revision &&
        !isExceptionClientId(
          revision,
          outdatedApiDepotClients,
          outdatedHarvestSources
        )
      ) {
        setIsShownAlertPublishedBal(true);
        setPublishedRevision(revision);
        return;
      }
    } catch {}

    // CHECK OTHER BAL IN MES_ADRESSES
    try {
      await checkOtherBALs();
    } catch (error) {
      pushToast({
        title: "Une erreur est survenue",
        intent: "danger",
        message: error.body?.message,
      });
      setIsLoading(false);
    }
  };

  const checkOtherBALs = async () => {
    const response: PageBaseLocaleDTO =
      await BasesLocalesService.searchBaseLocale(
        "10",
        "0",
        "false",
        commune.code,
        email
      );

    if (response.results.length > 0) {
      setUserBALs(response.results);
      setIsShownAlertOtherBal(true);
    } else {
      createNewBal();
    }
  };

  const onCancel = () => {
    setIsShownAlertPublishedBal(false);
    setIsShownAlertOtherBal(false);
    setIsLoading(false);
  };

  return (
    <Pane overflowY="scroll" marginY={32}>
      <FormContainer onSubmit={onSubmit}>
        {isShownAlertOtherBal && (
          <AlertOtherBal
            isShown={isShownAlertOtherBal}
            userEmail={email}
            basesLocales={userBALs}
            updateBAL={() => checkOtherBALs()}
            onConfirm={createNewBal}
            onClose={() => onCancel()}
          />
        )}

        {isShownAlertPublishedBal && (
          <AlertPublishedBal
            isShown={isShownAlertPublishedBal}
            revision={publishedRevision}
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
