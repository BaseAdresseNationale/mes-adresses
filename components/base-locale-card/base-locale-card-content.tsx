import React, { useState, useMemo, useContext } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Pane,
  Button,
  Tooltip,
  Text,
  UserIcon,
  InfoSignIcon,
  TrashIcon,
  EditIcon,
  KeyIcon,
  EyeOffIcon,
} from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";

import RecoverBALAlert from "@/components/bal-recovery/recover-bal-alert";
import CertificationCount from "@/components/certification-count";
import HabilitationTag from "../habilitation-tag";
import { ExtendedBaseLocaleDTO, HabilitationDTO } from "@/lib/openapi";
import { CommuneApiGeoType } from "@/lib/geo-api/type";
import LayoutContext from "@/contexts/layout";

interface BaseLocaleCardContentProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune?: CommuneApiGeoType;
  habilitation?: HabilitationDTO;
  isAdmin: boolean;
  userEmail: string;
  onSelect?: () => void;
  onRemove?: (e: any) => void;
  onHide?: (e: any) => void;
  isShownHabilitationStatus?: boolean;
}

function BaseLocaleCardContent({
  isAdmin,
  baseLocale,
  commune,
  habilitation,
  isShownHabilitationStatus,
  userEmail,
  onSelect,
  onRemove,
  onHide,
}: BaseLocaleCardContentProps) {
  const { status, _created, emails } = baseLocale;
  const { isMobile } = useContext(LayoutContext);
  const [isBALRecoveryShown, setIsBALRecoveryShown] = useState(false);

  const { getBalToken } = useContext(LocalStorageContext);
  const hasToken = useMemo(() => {
    return Boolean(getBalToken(baseLocale._id));
  }, [baseLocale._id, getBalToken]);

  const createDate = format(new Date(_created), "PPP", { locale: fr });
  const isDeletable =
    status === ExtendedBaseLocaleDTO.status.DRAFT ||
    status === ExtendedBaseLocaleDTO.status.DEMO;
  const tooltipContent =
    "Vous ne pouvez pas supprimer une Base Adresse Locale qui est publiée. Si vous souhaitez la dé-publier, veuillez contacter le support adresse@data.gouv.fr";

  const isHabilitationValid = useMemo(() => {
    if (!habilitation || !commune) {
      return false;
    }

    return (
      habilitation.status === "accepted" &&
      new Date(habilitation.expiresAt) > new Date()
    );
  }, [commune, habilitation]);

  return (
    <>
      <Pane
        borderTop
        flex={3}
        display="flex"
        paddingTop="1em"
        flexDirection={isMobile ? "column" : "row"}
      >
        <Pane
          flex={1}
          textAlign="center"
          margin="auto"
          {...(isMobile && { marginBottom: 10 })}
        >
          <Text>
            Créée le{" "}
            <Pane>
              <b>{createDate}</b>
            </Pane>
          </Text>
        </Pane>

        {isShownHabilitationStatus && commune && (
          <Pane
            display="flex"
            justifyContent="center"
            flex={1}
            textAlign="center"
            margin="auto"
            {...(isMobile && { marginBottom: 10 })}
          >
            <Text marginRight={5}>
              {isHabilitationValid ? "BAL habilitée" : "BAL non habilitée"}
            </Text>
            <HabilitationTag
              communeName={commune.nom}
              isHabilitationValid={isHabilitationValid}
            />
          </Pane>
        )}

        {commune && (
          <Pane
            flex={1}
            textAlign="center"
            margin="auto"
            {...(isMobile && { marginBottom: 10 })}
          >
            <Text display="block">Adresses certifiées</Text>
            <CertificationCount
              nbNumeros={baseLocale.nbNumeros}
              nbNumerosCertifies={baseLocale.nbNumerosCertifies}
            />
          </Pane>
        )}

        {emails && isAdmin && (
          <Pane
            flex={1}
            textAlign="center"
            padding="8px"
            display="flex"
            flexDirection="row"
            justifyContent="center"
            margin="auto"
          >
            <Text>
              {emails.length < 2
                ? "1 Administrateur"
                : `${emails.length} Administrateurs`}
            </Text>
            <Tooltip
              content={emails.map((email) => (
                <Pane key={email} fontFamily="Helvetica Neue" padding=".5em">
                  <UserIcon
                    marginRight=".5em"
                    style={{ verticalAlign: "middle" }}
                  />
                  {email}
                </Pane>
              ))}
              appearance="card"
            >
              <InfoSignIcon marginY="auto" marginX=".5em" />
            </Tooltip>
          </Pane>
        )}
        {isAdmin && status === "demo" && (
          <Pane
            flex={1}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            marginY="auto"
            textAlign="center"
          >
            <Text>
              <small>
                <i>
                  Pas d’administrateur
                  <br /> pour les BAL de démonstration
                </i>
              </small>
            </Text>
          </Pane>
        )}
      </Pane>

      {isAdmin ? (
        <Pane
          borderTop
          display="flex"
          justifyContent="space-between"
          paddingTop="1em"
          marginTop="1em"
        >
          <Pane display="flex" flexFlow="wrap" gap={8}>
            {hasToken &&
              (isDeletable ? (
                <Button
                  iconAfter={TrashIcon}
                  intent="danger"
                  disabled={!onRemove}
                  onClick={onRemove}
                >
                  {isMobile ? "Supprimer" : "Supprimer définitivement"}
                </Button>
              ) : (
                <Tooltip content={tooltipContent}>
                  {/* Button disabled props prevents pointer-events. Button is wrap in <Pane> to allow tooltip content to display => https://evergreen.segment.com/components/buttons#disabled_state */}
                  <Pane>
                    <Button disabled iconAfter={TrashIcon}>
                      {isMobile ? "Supprimer" : "Supprimer définitivement"}
                    </Button>
                  </Pane>
                </Tooltip>
              ))}

            {onHide && (
              <Button iconAfter={EyeOffIcon} onClick={onHide}>
                {isMobile ? "Masquer" : "Masquer de la liste"}
              </Button>
            )}
          </Pane>

          {hasToken ? (
            <Button
              appearance="primary"
              iconAfter={EditIcon}
              marginLeft={8}
              marginRight={8}
              flexShrink={0}
              onClick={onSelect}
              disabled={!onSelect}
            >
              {isMobile ? "Gérer" : "Gérer les adresses"}
            </Button>
          ) : (
            <>
              <RecoverBALAlert
                isShown={isBALRecoveryShown}
                defaultEmail={userEmail}
                baseLocaleId={baseLocale._id}
                onClose={() => {
                  setIsBALRecoveryShown(false);
                }}
              />
              <Button
                iconAfter={KeyIcon}
                marginRight="8px"
                onClick={() => {
                  setIsBALRecoveryShown(true);
                }}
              >
                Récupérer l’accès
              </Button>
            </>
          )}
        </Pane>
      ) : (
        <Pane
          borderTop
          display="flex"
          justifyContent="flex-end"
          paddingTop="1em"
          marginTop="1em"
        >
          <Button appearance="primary" marginRight="8px" onClick={onSelect}>
            Consulter
          </Button>
        </Pane>
      )}
    </>
  );
}

export default BaseLocaleCardContent;
