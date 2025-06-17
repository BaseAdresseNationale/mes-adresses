import React from "react";
import NextImage from "next/legacy/image";
import {
  Pane,
  Heading,
  Text,
  Link,
  Alert,
  UnorderedList,
  ListItem,
  EnvelopeIcon,
  SendMessageIcon,
  EyeOpenIcon,
} from "evergreen-ui";

import PinField, { usePinField } from "react-pin-field";

interface CodeValidationProps {
  email: string;
  handleSubmit: (code: string) => Promise<void>;
  resendCode: () => Promise<boolean>;
  flagURL: string | null;
}

function CodeValidation({
  email,
  handleSubmit,
  resendCode,
  flagURL,
}: CodeValidationProps) {
  const handler = usePinField();

  const handleCodeComplete = (code: string) => {
    handler.setValue("");
    handleSubmit(code);
  };

  return (
    <Pane>
      <Pane
        display="flex"
        alignItems="center"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        <NextImage
          width={66}
          height={66}
          src={flagURL || "/static/images/mairie.svg"}
          alt="logo mairie"
        />
        <Heading is="h2" marginTop={16}>
          Authentification de la mairie
        </Heading>
      </Pane>

      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        <Heading is="h3" textAlign="center">
          Entrez le code qui vous a été envoyé à l’adresse : {email}
        </Heading>
        <Pane display="flex" justifyContent="center" gap={8} marginY={32}>
          <PinField
            length={6}
            handler={handler}
            onComplete={handleCodeComplete}
            style={{
              height: "40px",
              width: "40px",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              padding: "16px",
            }}
          />
        </Pane>
        <Alert
          title="Le code ne sera plus valable si vous fermez la fenètre"
          marginBottom={16}
          textAlign="left"
        />
      </Pane>
      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        <Heading>Vous n’avez pas reçu votre code ?</Heading>
        <UnorderedList>
          <ListItem icon={EyeOpenIcon}>
            <Text size={400}>Consultez vos spam</Text>
          </ListItem>

          <ListItem icon={EnvelopeIcon}>
            <Text>
              Autorisez l&apos;adresse
              &quot;mes-adresses-no-reply@adresse.data.gouv.fr&quot; dans les
              paramètres de votre anti-spams (Mailinblack par exemple)
            </Text>
          </ListItem>

          <ListItem icon={SendMessageIcon}>
            <Pane cursor="pointer" onClick={resendCode}>
              <Link>Renvoyez le code</Link>
            </Pane>
          </ListItem>
        </UnorderedList>
      </Pane>
    </Pane>
  );
}

export default React.memo(CodeValidation);
