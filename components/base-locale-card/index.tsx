import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Heading,
  Card,
  Pane,
  Text,
  ChevronRightIcon,
  ChevronDownIcon,
  Link,
} from "evergreen-ui";

import { ApiGeoService } from "@/lib/geo-api";

import StatusBadge from "@/components/status-badge";
import BaseLocaleCardContent from "@/components/base-locale-card/base-locale-card-content";
import {
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
} from "@/lib/openapi";
import { CommuneApiGeoType } from "@/lib/geo-api/type";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

interface BaseLocaleCardProps {
  baseLocale: ExtendedBaseLocaleDTO;
  isAdmin?: boolean;
  userEmail?: string;
  onRemove?: (e: any) => void;
  onHide?: (e: any) => void;
  onSelect?: () => void;
  isDefaultOpen?: boolean;
  isShownHabilitationStatus?: boolean;
}

function BaseLocaleCard({
  baseLocale,
  isAdmin,
  userEmail,
  isShownHabilitationStatus,
  isDefaultOpen,
  onSelect,
  onRemove,
  onHide,
}: BaseLocaleCardProps) {
  const { nom, _updated } = baseLocale;
  const [commune, setCommune] = useState<CommuneApiGeoType>();
  const [habilitation, setHabilitation] = useState<HabilitationDTO | null>(
    null
  );
  const [isHabilitationValid, setIsHabilitationValid] =
    useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(isAdmin ? isDefaultOpen : false);

  const majDate = formatDistanceToNow(new Date(_updated), { locale: fr });

  const handleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchCommune = async () => {
      const commune: CommuneApiGeoType = await ApiGeoService.getCommune(
        baseLocale.commune
      );

      setCommune(commune);
    };

    const fetchHabilitationIsValid = async () => {
      try {
        const isValid: boolean = await HabilitationService.findIsValid(
          baseLocale._id
        );
        setHabilitation(null);
        setIsHabilitationValid(isValid);
      } catch {
        setHabilitation(null);
      }
    };

    const fetchHabilitation = async () => {
      try {
        const habilitation: HabilitationDTO =
          await HabilitationService.findHabilitation(baseLocale._id);
        setHabilitation(habilitation);

        const isAccepted = habilitation.status === "accepted";
        const isExpired = new Date(habilitation.expiresAt) < new Date();
        setIsHabilitationValid(isAccepted && !isExpired);
      } catch {
        setHabilitation(null);
        setIsHabilitationValid(false);
      }
    };

    void fetchCommune();
    if (!baseLocale.token) {
      void fetchHabilitationIsValid();
    } else {
      void fetchHabilitation();
    }
  }, [baseLocale]);

  return (
    <Card
      border
      elevation={2}
      margin={12}
      padding={6}
      background={baseLocale.status === "demo" ? "#E4E7EB" : "tint1"}
    >
      <Pane
        display="flex"
        justifyContent="space-between"
        cursor="pointer"
        onClick={handleIsOpen}
        padding={6}
      >
        <Pane>
          <Pane display="flex">
            {isOpen ? (
              <ChevronDownIcon size={20} marginRight={10} />
            ) : (
              <ChevronRightIcon size={20} marginRight={10} />
            )}
            <Heading fontSize="18px">{nom}</Heading>
          </Pane>
          <Pane marginLeft={30}>
            <Text fontSize={12} fontStyle="italic">
              {_updated
                ? "Dernière mise à jour il y a " + majDate
                : "Jamais mise à jour"}{" "}
              -
            </Text>

            {commune && (
              <Link
                onClick={(e) => e.stopPropagation()}
                href={`${ADRESSE_URL}/commune/${commune.code}`}
                fontStyle="italic"
              >
                {" "}
                {commune.nom}{" "}
                {commune.codeDepartement ? `(${commune.codeDepartement})` : ""}
              </Link>
            )}
          </Pane>
        </Pane>

        <Pane
          height={40}
          minWidth={120}
          borderRadius={5}
          width="25%"
          marginLeft={5}
        >
          <StatusBadge
            status={baseLocale.status}
            sync={baseLocale.sync}
            isHabilitationValid={isHabilitationValid}
          />
        </Pane>
      </Pane>

      {isOpen && (
        <BaseLocaleCardContent
          isAdmin={isAdmin}
          userEmail={userEmail}
          baseLocale={baseLocale}
          commune={commune}
          habilitation={habilitation}
          isShownHabilitationStatus={isShownHabilitationStatus}
          onSelect={onSelect}
          onRemove={onRemove}
          onHide={onHide}
        />
      )}
    </Card>
  );
}

export default BaseLocaleCard;
