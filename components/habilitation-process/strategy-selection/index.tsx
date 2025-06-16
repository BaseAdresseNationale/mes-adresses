import React, { useState } from "react";
import {
  Pane,
  Strong,
  Alert,
  Text,
  Heading,
  PeopleIcon,
  TimeIcon,
  UnorderedList,
  ListItem,
} from "evergreen-ui";

import CodeEmail from "@/components/habilitation-process/strategy-selection/code-email";
import { StrategyDTO } from "@/lib/openapi-api-bal";
import ProConnect from "./pro-connect";

interface StrategySelectionProps {
  codeCommune: string;
  emailSelected: string;
  setEmailSelected: React.Dispatch<React.SetStateAction<string>>;
  handleStrategy: (strategy: StrategyDTO.type) => void;
}

export function StrategySelection({
  codeCommune,
  emailSelected,
  setEmailSelected,
  handleStrategy,
}: StrategySelectionProps) {
  const [hovered, setHovered] = useState<StrategyDTO.type | null>(null);

  return (
    <Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        background="white"
        padding={16}
        borderRadius={8}
      >
        <Heading is="h2" textAlign="center">
          Habilitez votre <Strong size={400}>Base Adresse Locale</Strong> pour
          la publier dans la <Strong size={400}>Base Adresse Nationale</Strong>.
        </Heading>
      </Pane>

      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(330px, 1fr))"
        marginTop={16}
        gap={16}
        background="gray300"
      >
        <Pane
          onMouseEnter={() => setHovered(StrategyDTO.type.EMAIL)}
          onMouseLeave={() => setHovered(null)}
          elevation={hovered === StrategyDTO.type.EMAIL ? 3 : 0}
          background="white"
          padding={16}
          borderRadius={8}
          flex={1}
        >
          <CodeEmail
            codeCommune={codeCommune}
            emailSelected={emailSelected}
            setEmailSelected={setEmailSelected}
            handleStrategy={() => handleStrategy(StrategyDTO.type.EMAIL)}
          />
        </Pane>
        <Pane
          onMouseEnter={() => setHovered(StrategyDTO.type.PROCONNECT)}
          onMouseLeave={() => setHovered(null)}
          elevation={hovered === StrategyDTO.type.PROCONNECT ? 3 : 0}
          background="white"
          padding={16}
          borderRadius={8}
          flex={1}
        >
          <ProConnect
            handleStrategy={() => handleStrategy(StrategyDTO.type.PROCONNECT)}
          />
        </Pane>
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginTop={16}
      >
        <Heading>Comprendre l’habilitation</Heading>
        <UnorderedList>
          <ListItem icon={PeopleIcon}>
            <Text size={400}>
              Elle permet de s&apos;assurer que la publication est{" "}
              <Strong size={400}>réalisée par une personne compétente</Strong>{" "}
              en matière d&apos;adressage.
            </Text>
          </ListItem>

          <ListItem icon={TimeIcon}>
            <Text size={400}>
              Elle est <Strong size={400}>valable 1 an</Strong> et doit être
              renouvelée pour continuer la mise à jour de l'adressage
            </Text>
          </ListItem>
        </UnorderedList>
        <Alert title="Besoin d'aide pour vous habiliter ?" marginTop={16}>
          <Text is="div" marginTop={8}>
            Contactez nous à{" "}
            <a href="mailto:adresse@data.gouv.fr">adresse@data.gouv.fr</a>
          </Text>
        </Alert>
      </Pane>
    </Pane>
  );
}
