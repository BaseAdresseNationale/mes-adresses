import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Pane,
  TabNavigation,
  Tab,
  Heading,
  Paragraph,
  Button,
  ArrowLeftIcon,
} from "evergreen-ui";
import Link from "next/link";

import { ApiGeoService } from "../lib/geo-api";

import LocalStorageContext from "../contexts/local-storage";

import { useInput } from "../hooks/input";

import Main from "../layouts/main";

import CreateForm from "../components/new/create-form";
import UploadForm from "../components/new/upload-form";
import DemoForm from "../components/new/demo-form";
import { CommuneType } from "../types/commune";
import { ApiBalAdminService } from "@/lib/bal-admin";
import { BALWidgetConfig } from "@/lib/bal-admin/type";

interface IndexPageProps {
  defaultCommune?: CommuneType;
  widgetConfig: BALWidgetConfig
  isDemo: boolean;
}

const getSuggestedBALName = (commune?: CommuneType) => {
  return commune ? `Adresses de ${commune.nom}` : null;
};

function IndexPage({ defaultCommune, widgetConfig, isDemo }: IndexPageProps) {
  const { balAccess } = useContext(LocalStorageContext);

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
  const [selectedCommune, setSelectedCommune] = useState(defaultCommune);

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
                  widgetConfig={widgetConfig}
                  nom={nom}
                  onNomChange={onNomChange}
                  email={email}
                  onEmailChange={onEmailChange}
                  handleCommune={setSelectedCommune}
                />
              ) : (
                <UploadForm
                  namePlaceholder={suggestedBALName.current.suggested}
                  widgetConfig={widgetConfig}
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

        {balAccess && (
          <Pane marginLeft={16} marginY={8}>
            <Link legacyBehavior href="/" passHref>
              <Button is="a" iconBefore={ArrowLeftIcon}>
                Retour à la liste de mes Bases Adresses Locales
              </Button>
            </Link>
          </Pane>
        )}
      </Pane>

      {!isDemo && (
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
  const widgetConfig: BALWidgetConfig = await ApiBalAdminService.getBALWidgetConfig()
  return {
    props: {
      defaultCommune,
      widgetConfig,
      isDemo: query.demo === "1",
    },
  };
}

export default IndexPage;
