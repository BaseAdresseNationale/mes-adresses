import { useState, useEffect, useCallback, useContext } from "react";
import Router from "next/router";
import { uniq } from "lodash";
import { Pane, Dialog, Alert, Paragraph, Strong } from "evergreen-ui";

import { ApiGeoService } from "@/lib/geo-api";

import LocalStorageContext from "@/contexts/local-storage";

import BaseLocaleCard from "@/components/base-locale-card";
import DeleteWarning from "@/components/delete-warning";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";

interface AlertOtherBALProps {
  isShown: boolean;
  userEmail: string;
  onClose: () => void;
  onConfirm: () => void;
  basesLocales: ExtendedBaseLocaleDTO[];
  updateBAL: () => void;
}

function AlertOtherBAL({
  isShown = false,
  userEmail,
  onClose,
  onConfirm,
  basesLocales,
  updateBAL,
}: AlertOtherBALProps) {
  const { removeBAL } = useContext(LocalStorageContext);

  const [communeLabel, setCommuneLabel] = useState("cette commune");
  const [isLoading, setIsLoading] = useState(false);
  const uniqCommunes = uniq(basesLocales.map(({ commune }) => commune));
  const [toRemove, setToRemove] = useState(null);

  useEffect(() => {
    const fetchCommune = async (code) => {
      const commune = await ApiGeoService.getCommune(code);
      if (commune) {
        setCommuneLabel(commune.nom);
      }
    };

    fetchCommune(basesLocales[0].commune);
  }, [basesLocales]);

  const onBalSelect = (bal) => {
    Router.push(`/bal/${bal.id}`);
  };

  const onRemove = useCallback(async () => {
    await removeBAL(toRemove);
    setToRemove(null);
    updateBAL();
  }, [toRemove, updateBAL, removeBAL]);

  const handleConfirmation = () => {
    setIsLoading(true);
    onConfirm();
  };

  const handleRemove = useCallback((e, balId) => {
    e.stopPropagation();
    setToRemove(balId);
  }, []);

  return (
    <>
      <DeleteWarning
        isShown={Boolean(toRemove)}
        content={
          <Paragraph>
            Êtes vous bien sûr de vouloir supprimer cette Base Adresse Locale ?
            Cette action est définitive.
          </Paragraph>
        }
        onCancel={() => setToRemove(null)}
        onConfirm={onRemove}
      />
      <Dialog
        isShown={isShown}
        title={
          uniqCommunes.length > 1
            ? "Vous avez déjà des Bases Adresses Locales pour ces communes"
            : `Vous avez déjà créé une Base Adresse Locale pour ${communeLabel}`
        }
        width="800px"
        confirmLabel={isLoading ? "Création..." : "Continuer"}
        cancelLabel="Annuler"
        hasCancel={!isLoading}
        isConfirmLoading={isLoading}
        onConfirm={handleConfirmation}
        onCloseComplete={onClose}
      >
        <Pane>
          <Alert margin="1em" display="block" hasIcon={false}>
            <Paragraph marginTop={8}>
              {uniqCommunes.length > 1 ? (
                <>
                  Il semblerait que vous ayez <Strong>déjà créé</Strong> des
                  Bases Adresses Locales pour ces communes.
                </>
              ) : (
                <>
                  Une Base Adresse Locale a déjà été créée pour{" "}
                  <Strong>{communeLabel}</Strong>.
                </>
              )}
            </Paragraph>
            <Paragraph marginTop={8}>
              {basesLocales.length > 1 ? (
                <>
                  Nous vous{" "}
                  <Strong>recommandons de continuer l’adressage</Strong> sur une
                  de vos Bases Adresses Locales <Strong>déjà existantes</Strong>{" "}
                  parmi la liste ci-dessous.
                </>
              ) : (
                <>
                  Nous vous{" "}
                  <Strong>recommandons de continuer l’adressage</Strong> sur
                  votre Base Adresses Locales <Strong>déjà existante</Strong>{" "}
                  ci-dessous.
                </>
              )}
            </Paragraph>
            <Paragraph marginTop={8}>
              Pour reprendre votre travail,{" "}
              {basesLocales.length > 1 && (
                <>
                  <Strong>sélectionnez une Base Adresse Locale</Strong> puis
                </>
              )}{" "}
              <Strong>
                cliquez sur &quot;Gérer&nbsp;mes&nbsp;adresses&quot;
              </Strong>
              .
            </Paragraph>
            <Paragraph marginTop={8}>
              Vous pouvez toutefois cliquer sur{" "}
              <Strong>
                &quot;Créer&nbsp;une&nbsp;nouvelle&nbsp;Base&nbsp;Adresses&nbsp;Locales&quot;
              </Strong>{" "}
              si vous souhaitez <Strong>recommencer l’adressage</Strong>.
            </Paragraph>
          </Alert>

          {basesLocales.map((bal) => (
            <BaseLocaleCard
              key={bal.id}
              isAdmin
              userEmail={userEmail}
              isDefaultOpen={basesLocales.length === 1}
              baseLocale={bal}
              onSelect={() => onBalSelect(bal)}
              onRemove={(e) => handleRemove(e, bal.id)}
            />
          ))}
        </Pane>
        {isLoading && (
          <Pane
            position="fixed"
            left="0"
            bottom="80px"
            width="100%"
            paddingTop={12}
            paddingLeft={24}
            paddingRight={24}
            background="white"
          >
            <Alert
              intent="none"
              title="Cette operation peut prendre plusieurs minutes"
              marginTop={12}
            />
          </Pane>
        )}
      </Dialog>
    </>
  );
}

export default AlertOtherBAL;
