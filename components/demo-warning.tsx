import { useState, useCallback, useContext } from "react";
import {
  Pane,
  Text,
  Button,
  Dialog,
  TextInputField,
  WarningSignIcon,
} from "evergreen-ui";

import { BasesLocalesService } from "@/lib/openapi/services/BasesLocalesService";

import BalDataContext from "@/contexts/bal-data";

import { useInput } from "@/hooks/input";
import useFocus from "@/hooks/focus";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi";
import LayoutContext from "@/contexts/layout";

interface DemoWarningProps {
  baseLocale: ExtendedBaseLocaleDTO;
  communeName: string;
}

function DemoWarning({ baseLocale, communeName }: DemoWarningProps) {
  const [isShown, setIsShown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nom, setNom] = useState(`Adresses de ${communeName}`);
  const [email, onEmailChange] = useInput();
  const [ref, setIsFocus] = useFocus();
  const { isMobile, pushToast } = useContext(LayoutContext);

  const { reloadBaseLocale } = useContext(BalDataContext);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        await BasesLocalesService.updateBaseLocaleDemoToDraft(baseLocale.id, {
          nom: nom ? nom.trim() : null,
          email,
        });

        await reloadBaseLocale();
      } catch (error: unknown) {
        pushToast({
          title: "Erreur",
          message: "Impossible de conserver cette Base Adresse Locale",
          intent: "danger",
        });
      }

      setIsShown(false);
      setIsLoading(false);
    },
    [baseLocale.id, email, nom, reloadBaseLocale, pushToast]
  );

  return (
    <Pane
      width="100%"
      textAlign="center"
      backgroundColor="orange"
      position="fixed"
      bottom={0}
      height={50}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <WarningSignIcon
        size={20}
        marginX=".5em"
        style={{ verticalAlign: "sub" }}
      />
      <Text fontSize={isMobile ? 10 : 14}>
        Cette Base Adresse Locale de démonstration sera supprimée d’ici 24
        heures sans modifications
      </Text>

      <Dialog
        isShown={isShown}
        title="Sauvegarder mes modifications"
        cancelLabel="Annuler"
        intent="success"
        isConfirmLoading={isLoading}
        confirmLabel="Conserver"
        hasFooter={false}
        onCloseComplete={() => {
          setIsShown(false);
        }}
        onOpenComplete={() => {
          setIsFocus(true);
        }}
      >
        <form onSubmit={onSubmit}>
          <TextInputField
            ref={ref}
            required
            autoComplete="new-password" // Hack to bypass chrome autocomplete
            name="nom"
            id="nom"
            disabled={isLoading}
            value={nom}
            label="Nom de la Base Adresse Locale"
            placeholder={communeName}
            onChange={(e) => {
              setNom(e.target.value as string);
            }}
          />

          <TextInputField
            required
            type="email"
            name="email"
            id="email"
            disabled={isLoading}
            value={email}
            label="Votre adresse email"
            placeholder="nom@example.com"
            onChange={onEmailChange}
          />
          <Button
            appearance="primary"
            intent="success"
            isLoading={isLoading}
            type="submit"
          >
            Sauvegarder
          </Button>
        </form>
      </Dialog>

      <Button
        height={24}
        marginX=".5em"
        width="fit-content"
        onClick={() => {
          setIsShown(true);
        }}
      >
        Je souhaite la conserver
      </Button>
    </Pane>
  );
}

export default DemoWarning;
