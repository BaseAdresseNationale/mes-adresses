import { useState } from "react";
import NextImage from "next/legacy/image";
import {
  Pane,
  Heading,
  Text,
  Link,
  TextInput,
  IconButton,
  TickIcon,
  Alert,
} from "evergreen-ui";

import FormInput from "@/components/form-input";
import FormContainer from "@/components/form-container";

interface CodeValidationProps {
  email: string;
  handleSubmit: (code: string) => Promise<void>;
  resendCode: () => Promise<boolean>;
}

function CodeValidation({
  email,
  handleSubmit,
  resendCode,
}: CodeValidationProps) {
  const [code, setCode] = useState("");
  const [codeMask, setCodeMask] = useState("______");

  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(code);
    setCode("");
  };

  const handleCode = (event) => {
    // Récupérer la valeur de l'input
    const { value } = event.target;

    // Supprimer tout ce qui n'est pas un chiffre dans l'input (lettres et caractères spéciaux)
    const input = value.replaceAll("_", "").replace(/\D/, "");

    if (input.length < 7) {
      // Si on efface, supprimer la dernière valeur de l'input
      const hasMissingNumbers = value.length < 6 && code.length < 6;
      const newCode = input.slice(0, hasMissingNumbers ? -1 : 6);

      // On set code avec la bonne valeur, cleané de tout caractères spéciaux
      setCode(newCode);
      // On set codeMask avec les bonnes valeurs + les underscores pour les chiffres encore manquants
      setCodeMask(newCode.padEnd(6, "_"));
    }
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
          width={54}
          height={54}
          src="/static/images/mairie.svg"
          alt="logo mairie"
        />
        <Heading is="h2">Authentification de la mairie</Heading>
      </Pane>

      <Pane
        display="flex"
        flexDirection="column"
        background="white"
        padding={16}
        borderRadius={8}
        marginBottom={16}
      >
        <Pane is="form">
          <FormInput>
            <Heading is="h3">
              Entrez le code qui vous a été envoyé à l’adresse : {email}
            </Heading>
            <Pane display="flex" justifyContent="center" marginY={16}>
              <TextInput
                autoFocus
                name="code"
                type="text"
                value={codeMask}
                placeholder="Entrez votre code ici"
                textAlign="center"
                width="70%"
                fontSize={32}
                height={50}
                fontWeight="bold"
                letterSpacing={10}
                paddingY={16}
                style={{ caretColor: "transparent" }}
                onChange={handleCode}
              />

              <IconButton
                appearance="primary"
                intent="success"
                size="large"
                marginLeft={16}
                height={50}
                disabled={code.length !== 6}
                onClick={onSubmit}
                icon={TickIcon}
              />
            </Pane>
          </FormInput>
        </Pane>

        <Text>Vous n’avez pas reçu votre code ?</Text>
        <Pane cursor="pointer" onClick={resendCode} marginBottom={16}>
          <Link>Renvoyer un code</Link>
        </Pane>

        <Alert
          title="Vous ne recevez pas le code d'habilitation"
          marginBottom={16}
          textAlign="left"
        >
          <Text>
            Autorisez l&apos;adresse &quot;adresse@data.gouv.fr&quot; dans les
            paramètre de votre anti-spams (Mailinblack par exemple)
          </Text>
        </Alert>
        <Alert
          title="Le code ne sera plus valable si vous fermez la fenètre"
          marginBottom={16}
          textAlign="left"
        ></Alert>
      </Pane>
    </Pane>
  );
}

export default CodeValidation;
