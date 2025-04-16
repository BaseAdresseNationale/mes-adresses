import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Pane,
  TabNavigation,
  Tab,
  Heading,
  Paragraph,
  Button,
} from "evergreen-ui";
import Link from "next/link";

import { ApiGeoService } from "../lib/geo-api";

import { useInput } from "../hooks/input";

import Main from "../layouts/main";

import CreateForm from "../components/new/create-form";
import UploadForm from "../components/new/upload-form";
import DemoForm from "../components/new/demo-form";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { BALWidgetConfig } from "@/lib/bal-admin/type";
import LayoutContext from "@/contexts/layout";
import { CommuneType } from "@/types/commune";

export interface CommuneSimpleType {
  nom: string;
  code: string;
}

interface IndexPageProps {
  defaultCommune?: CommuneType;
  outdatedApiDepotClients: string[];
  outdatedHarvestSources: string[];
  isDemo: boolean;
}

const getCommune = (commune?: CommuneType): CommuneSimpleType => {
  return commune ? { code: commune.code, nom: commune.nom } : null;
};

const getSuggestedBALName = (commune?: CommuneSimpleType) => {
  return commune ? `Adresses de ${commune.nom}` : null;
};

function IndexPage({
  defaultCommune,
  outdatedApiDepotClients,
  outdatedHarvestSources,
  isDemo,
}: IndexPageProps) {
  const { isMobile } = useContext(LayoutContext);

  const suggestedBALName = useRef<{
    prev: string | null;
    suggested: string | null;
    used: boolean | undefined;
  }>({
    prev: null,
    suggested: getSuggestedBALName(defaultCommune),
    used: undefined,
  });

  const [nom, onNomChange, resetInput] = useInput(
    suggestedBALName.current.suggested
  );
  const [email, onEmailChange] = useInput("");
  const [selectedCommune, setSelectedCommune] =
    useState<CommuneSimpleType | null>(getCommune(defaultCommune));

  const [index, setIndex] = useState(0);

  useEffect(() => {
    suggestedBALName.current = {
      prev: suggestedBALName.current.suggested, // Suggestion for previous commune
      suggested: getSuggestedBALName(selectedCommune), // Current suggestion
      used: false, // True when current suggestion has been used
    };
  }, [selectedCommune]);

  useEffect(() => {
    const { prev, suggested, used } = suggestedBALName.current;
    if ((nom === "" && !used) || nom === prev) {
      resetInput(suggested);
      suggestedBALName.current = { ...suggestedBALName.current, used: true };
    }
  }, [nom, selectedCommune, resetInput]);

  return (
    <Main>
      <Pane padding={12}>
        <Heading size={600} marginBottom={8}>{`Nouvelle Base Adresse Locale ${
          isDemo ? "de démonstration" : ""
        }`}</Heading>
        <Paragraph>
          {`Sélectionnez une commune pour laquelle vous souhaitez créer ou modifier une Base Adresse Locale ${
            isDemo ? " de démonstration" : ""
          }.`}
        </Paragraph>
      </Pane>

      <Pane paddingTop={16} flex={1}>
        {isDemo ? (
          <DemoForm defaultCommune={defaultCommune} />
        ) : (
          <>
            <TabNavigation display="flex" marginLeft={16}>
              {["Créer", "Importer un fichier CSV"].map((tab, idx) => (
                <Tab
                  key={tab}
                  id={tab}
                  isSelected={index === idx}
                  onSelect={() => {
                    setIndex(idx);
                  }}
                >
                  {tab}
                </Tab>
              ))}
            </TabNavigation>

            <Pane flex={1} overflowY="scroll">
              {index === 0 ? (
                <CreateForm
                  namePlaceholder={suggestedBALName.current.suggested}
                  commune={selectedCommune}
                  outdatedApiDepotClients={outdatedApiDepotClients}
                  outdatedHarvestSources={outdatedHarvestSources}
                  nom={nom}
                  onNomChange={onNomChange}
                  email={email}
                  onEmailChange={onEmailChange}
                  handleCommune={setSelectedCommune}
                />
              ) : (
                <UploadForm
                  namePlaceholder={suggestedBALName.current.suggested}
                  outdatedApiDepotClients={outdatedApiDepotClients}
                  outdatedHarvestSources={outdatedHarvestSources}
                  nom={nom}
                  onNomChange={onNomChange}
                  email={email}
                  onEmailChange={onEmailChange}
                  handleCommune={setSelectedCommune}
                />
              )}
            </Pane>
          </>
        )}
      </Pane>

      {!isDemo && !isMobile && (
        <Pane display="flex" flex={1}>
          <Pane margin="auto" textAlign="center">
            <Heading marginBottom={8}>
              Vous voulez simplement essayer l’éditeur sans créer de Base
              Adresse Locale ?
            </Heading>
            <Link legacyBehavior href="/new?demo=1" passHref>
              <Button is="a">Essayer l’outil</Button>
            </Link>
          </Pane>
        </Pane>
      )}
    </Main>
  );
}

export async function getServerSideProps({ query }) {
  let defaultCommune = null;
  if (query.commune) {
    defaultCommune = await ApiGeoService.getCommune(query.commune, {
      fields: "departement",
    });
  }
  try {
    const widgetConfig: BALWidgetConfig =
      await ApiBalAdminService.getBALWidgetConfig();
    return {
      props: {
        defaultCommune,
        outdatedApiDepotClients:
          widgetConfig?.communes?.outdatedApiDepotClients || [],
        outdatedHarvestSources:
          widgetConfig?.communes?.outdatedHarvestSources || [],
        isDemo: query.demo === "1",
      },
    };
  } catch {
    return {
      props: {
        defaultCommune,
        outdatedApiDepotClients: [],
        outdatedHarvestSources: [],
        isDemo: query.demo === "1",
      },
    };
  }
}

export default IndexPage;
