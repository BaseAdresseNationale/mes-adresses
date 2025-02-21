import React, { useState } from "react";
import {
  Pane,
  Strong,
  Alert,
  Text,
  Heading,
  PeopleIcon,
  TimeIcon,
  LogInIcon,
  UnorderedList,
  ListItem,
} from "evergreen-ui";

import FranceConnect from "@/components/habilitation-process/strategy-selection/france-connect";
import CodeEmail from "@/components/habilitation-process/strategy-selection/code-email";
import { StrategyDTO } from "@/lib/openapi-api-bal";
import { ApiAnnuraireService } from "@/lib/api-annuaire";

interface StrategySelectionProps {
  codeCommune: string;
  emailSelected: string;
  setEmailSelected: React.Dispatch<React.SetStateAction<string>>;
  franceconnectAuthenticationUrl: string | null;
  handleStrategy: (strategy: StrategyDTO.type) => void;
}

export function StrategySelection({
  codeCommune,
  emailSelected,
  setEmailSelected,
  franceconnectAuthenticationUrl = null,
  handleStrategy,
}: StrategySelectionProps) {
  const [hovered, setHovered] = useState<StrategyDTO.type | null>(null);

  return (
    <Pane marginBottom={-16}>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginY={16}
      >
        <Text textAlign="center">
          Afin de pouvoir publier vos adresses dans la{" "}
          <Strong size={400}>Base Adresse Nationale</Strong>, votre{" "}
          <Strong size={400}>Base Adresse Locale</Strong> doit obtenir{" "}
          <Strong size={400}>une habilitation</Strong>.
        </Text>

        <Pane display="flex" flexDirection="column" marginTop={16}>
          <Heading textAlign="center" color="#225DF5">
            Comprendre l’habilitation en quelques points
          </Heading>
          <UnorderedList>
            <ListItem icon={PeopleIcon}>
              <Text size={400}>
                Permet à{" "}
                <Strong size={400}>
                  toute personne aillant accès à l’édition
                </Strong>{" "}
                de cette <Strong size={400}>Base Adresse Locale</Strong> de{" "}
                <Strong size={400}>mettre à jour</Strong> les adresses de sa
                commune.
              </Text>
            </ListItem>

            <ListItem icon={TimeIcon}>
              <Text size={400}>
                Elle est valable <Strong size={400}>1 an</Strong>.
              </Text>
            </ListItem>

            <ListItem icon={LogInIcon}>
              <Text size={400}>
                Pour l’obtenir, <Strong size={400}>un(e) élu(e)</Strong> de la
                commune ou <Strong size={400}>un(e) employé(e)</Strong> de la
                mairie doit <Strong size={400}>s’authentifier</Strong>.
              </Text>
            </ListItem>
          </UnorderedList>
        </Pane>
        <Alert title="Vous n’êtes pas habilité ?" marginTop={16}>
          <Text is="div" marginTop={8}>
            Prestataires et délégataires, contactez la mairie pour qu’elle
            puisse authentifier les adresses selon les modalités définies
            ci-dessus. Pour rappel, la commune reste responsable de ses
            adresses, même en cas de délégation de la réalisation technique de
            l’adressage.
          </Text>
        </Alert>
      </Pane>

      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(330px, 1fr))"
        marginX="-32px"
        padding={16}
        gap={16}
        background="gray300"
        textAlign="center"
      >
        <Pane
          onMouseEnter={() => setHovered(StrategyDTO.type.EMAIL)}
          onMouseLeave={() => setHovered(null)}
          elevation={hovered === StrategyDTO.type.EMAIL ? 3 : 0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          background="white"
          padding={16}
          borderRadius={8}
          height={415}
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
          onMouseEnter={() => setHovered(StrategyDTO.type.FRANCECONNECT)}
          onMouseLeave={() => setHovered(null)}
          elevation={hovered === StrategyDTO.type.FRANCECONNECT ? 3 : 0}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          alignItems="center"
          background="white"
          padding={16}
          borderRadius={8}
          height={415}
          flex={1}
        >
          <FranceConnect
            handleStrategy={() =>
              handleStrategy(StrategyDTO.type.FRANCECONNECT)
            }
            isDisabled={!franceconnectAuthenticationUrl}
          />
        </Pane>
      </Pane>
    </Pane>
  );
}
