import React, { useEffect, useMemo, useState } from "react";
import {
  Pane,
  Heading,
  Strong,
  Button,
  Alert,
  Text,
  OrderedList,
  Link,
  EnvelopeIcon,
  ListItem,
  SelectField,
} from "evergreen-ui";

import TextWrapper from "@/components/text-wrapper";
import { ApiAnnuraireService } from "@/lib/api-annuaire";

function isEmail(email) {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(String(email).toLowerCase());
}

const TextValidEmail = React.memo(function TextValidEmail() {
  return (
    <>
      <Text is="div" marginTop={8} size={400}>
        Vous serez ensuite invité à taper ce code, confirmant ainsi la gestion
        de cette Base Adresse Locale par un(e) employé(e) de mairie.
      </Text>

      <Alert
        title="Cette adresse email est incorrecte ou obsolète ?"
        width="100%"
        marginTop={16}
        textAlign="left"
        overflow="auto"
      >
        <TextWrapper placeholder="Mettre à jour l’adresse email">
          <AnnuaireServicePublic />
        </TextWrapper>
      </Alert>
    </>
  );
});

const TextInvalidEmail = React.memo(function TextInvalidEmail({
  email,
}: {
  email: string;
}) {
  return (
    <Alert
      intent="danger"
      title="Adresse email invalide"
      marginTop={16}
      textAlign="left"
    >
      <Text is="div" marginY={8} size={400}>
        L’adresse email renseignée : <Strong>{email}</Strong>, ne peut pas être
        utilisée afin d’envoyer un code d’authentification.
      </Text>
      <TextWrapper placeholder="Mettre à jour l’adresse email">
        <AnnuaireServicePublic />
      </TextWrapper>
    </Alert>
  );
});

const AnnuaireServicePublic = React.memo(function AnnuaireServicePublic() {
  return (
    <OrderedList>
      <ListItem>
        Rendez vous sur{" "}
        <Link href="https://lannuaire.service-public.fr/">
          lannuaire.service-public.fr
        </Link>
      </ListItem>
      <ListItem>Consultez la fiche annuaire de votre commune</ListItem>
      <ListItem>
        Cliquer sur le lien «Demander une mise à jour de cette page», visible en
        bas de page
      </ListItem>
    </OrderedList>
  );
});

interface CodeEmailProps {
  codeCommune: string;
  emailSelected: string;
  setEmailSelected: React.Dispatch<React.SetStateAction<string>>;
  handleStrategy: () => void;
}

function CodeEmail({
  codeCommune,
  emailSelected,
  setEmailSelected,
  handleStrategy,
}: CodeEmailProps) {
  const [emailsCommune, setEmailsCommune] = useState<string[]>([]);

  useEffect(() => {
    async function fetchEmailsCommune() {
      const emails = await ApiAnnuraireService.getEmailsCommune(codeCommune);
      setEmailsCommune(emails);
      if (emails.length > 0) {
        setEmailSelected(emails[0]);
      }
    }

    fetchEmailsCommune();
  }, [codeCommune, setEmailSelected]);

  const isValidEmailSelected = useMemo(() => {
    return isEmail(emailSelected);
  }, [emailSelected]);

  return (
    <>
      <Pane>
        <Heading is="h5" marginBottom={8}>
          Authentifier la mairie
        </Heading>
        <Button
          disabled={!emailSelected || !isValidEmailSelected}
          cursor={emailSelected ? "pointer" : "not-allowed"}
          appearance="primary"
          onClick={handleStrategy}
          display="flex"
          flexDirection="column"
          width={280}
          height={72}
          gap={6}
        >
          <EnvelopeIcon size={30} />
          Recevoir un code d’habilitation
        </Button>
      </Pane>

      {emailSelected ? (
        <>
          {emailsCommune.length === 1 && (
            <>
              {isValidEmailSelected ? (
                <>
                  <Text
                    is="div"
                    marginTop={8}
                    size={400}
                    display="flex"
                    flexDirection="column"
                  >
                    Un code d’habilitation vous sera envoyé à l’adresse :{" "}
                    <Strong whiteSpace="nowrap">{emailSelected}</Strong>
                  </Text>
                  <TextValidEmail />
                </>
              ) : (
                <TextInvalidEmail email={emailSelected} />
              )}
            </>
          )}
          {emailsCommune.length > 1 && (
            <>
              <SelectField
                label="Un code d’habilitation vous sera envoyé à l’adresse que vous selectionnez"
                marginTop={8}
                marginBottom={0}
                value={emailSelected}
                onChange={({ target }) => {
                  setEmailSelected(target.value);
                }}
              >
                {emailsCommune.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </SelectField>
              {isValidEmailSelected ? (
                <TextValidEmail />
              ) : (
                <TextInvalidEmail email={emailSelected} />
              )}
            </>
          )}
        </>
      ) : (
        <Alert
          intent="danger"
          title="Aucune adresse email connue pour cette commune"
          marginTop={16}
          textAlign="left"
          overflow="auto"
        >
          <TextWrapper
            placeholder="Mettre à jour l’adresse email"
            isOpenDefault
          >
            <AnnuaireServicePublic />
          </TextWrapper>
        </Alert>
      )}
    </>
  );
}

export default CodeEmail;
