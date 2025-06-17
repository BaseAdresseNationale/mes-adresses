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
  Spinner,
} from "evergreen-ui";

import TextWrapper from "@/components/text-wrapper";
import { ApiDepotService } from "@/lib/api-depot";

function isEmail(email) {
  const regexp =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(String(email).toLowerCase());
}

function TextValidEmail() {
  return (
    <>
      <Alert
        title="Ce courriel est incorrecte ou obsolète ?"
        width="100%"
        marginTop={16}
        textAlign="left"
        overflow="auto"
      >
        <TextWrapper placeholder="Mettez à jour le courriel">
          <AnnuaireServicePublic />
        </TextWrapper>
      </Alert>
    </>
  );
}

function TextInvalidEmail() {
  return (
    <Alert
      intent="danger"
      title="Courriel invalide"
      marginTop={16}
      textAlign="left"
    >
      <TextWrapper placeholder="Mettez à jour le courriel">
        <AnnuaireServicePublic />
      </TextWrapper>
    </Alert>
  );
}

function AnnuaireServicePublic() {
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
}

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchEmailsCommune() {
      setIsLoading(true);
      const emails = await ApiDepotService.getEmailsCommune(codeCommune);
      setEmailsCommune(emails);
      if (emails.length > 0) {
        setEmailSelected(emails[0]);
      }
      setIsLoading(false);
    }

    fetchEmailsCommune();
  }, [codeCommune, setEmailSelected]);

  const isValidEmailSelected = useMemo(() => {
    return isEmail(emailSelected);
  }, [emailSelected]);

  if (isLoading) {
    return (
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        <Spinner />
      </Pane>
    );
  }

  return (
    <>
      <Pane display="flex" flexDirection="column" alignItems="center">
        <Heading is="h5">Via le courriel officiel de la mairie</Heading>

        {emailsCommune.length === 1 && (
          <Text height={40} verticalAlign="middle" paddingTop={8}>
            <Strong whiteSpace="nowrap">{emailSelected}</Strong>
          </Text>
        )}
        {emailsCommune.length > 1 && (
          <SelectField
            marginTop={0}
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
        )}
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={16}
        marginBottom={32}
      >
        <Button
          disabled={!emailSelected || !isValidEmailSelected}
          cursor={emailSelected ? "pointer" : "not-allowed"}
          appearance="primary"
          onClick={handleStrategy}
          width={214}
          height={56}
          borderRadius={0}
          lineHeight="18px"
          iconBefore={<EnvelopeIcon size={40} />}
        >
          <Text
            whiteSpace="pre-line"
            color="white"
            fontSize={16}
            textAlign="left"
          >
            Recevoir un code d&apos;habilitation
          </Text>
        </Button>
      </Pane>

      {isValidEmailSelected ? <TextValidEmail /> : <TextInvalidEmail />}
    </>
  );
}

export default CodeEmail;
