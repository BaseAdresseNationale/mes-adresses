import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  Pane,
  Link,
  Heading,
  Text,
  EyeOffIcon,
  TrashIcon,
  ArrowRightIcon,
  Pulsar,
  Button,
  Icon,
} from "evergreen-ui";
import NextLink from "next/link";
import StatusBadge from "@/components/status-badge";
import {
  ExtendedBaseLocaleDTO,
  HabilitationDTO,
  HabilitationService,
  OpenAPI,
} from "@/lib/openapi-api-bal";
import CertificationCount from "../certification-count";
import HabilitationTag from "../habilitation-tag";
import { canFetchSignalements } from "@/lib/utils/signalement";
import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import { CommuneApiGeoType } from "@/lib/geo-api/type";
import { ApiGeoService } from "@/lib/geo-api";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

interface BaseLocaleCardProps {
  baseLocale: ExtendedBaseLocaleDTO;
  onRemove: () => void;
}

function BaseLocaleCard({ baseLocale, onRemove }: BaseLocaleCardProps) {
  const [commune, setCommune] = useState<CommuneApiGeoType | null>(null);
  const [isHabilitationValid, setIsHabilitationValid] = useState(false);
  const [pendingSignalementsCount, setPendingSignalementsCount] = useState(0);
  const [flag, setFlag] = useState<string | null>(null);
  const { id, status, sync, nom, updatedAt, nbNumeros, nbNumerosCertifies } =
    baseLocale;

  useEffect(() => {
    const fetchCommune = async () => {
      try {
        const commune: CommuneApiGeoType = await ApiGeoService.getCommune(
          baseLocale.commune
        );
        setCommune(commune);
      } catch (err) {
        console.error("Error fetching commune", err);
        setCommune(null);
      }
    };

    const fetchCommuneFlag = async () => {
      try {
        const flagUrl = await getCommuneFlagProxy(baseLocale.commune);
        setFlag(flagUrl);
      } catch (err) {
        console.error("Error fetching commune flag", err);
        setFlag(null);
      }
    };

    const fetchIsHabilitationValid = async () => {
      try {
        Object.assign(OpenAPI, { TOKEN: baseLocale.token });
        const habilitation: HabilitationDTO =
          await HabilitationService.findHabilitation(baseLocale.id);
        Object.assign(OpenAPI, { TOKEN: null });

        const isAccepted = habilitation.status === "accepted";
        const isExpired = new Date(habilitation.expiresAt) < new Date();

        setIsHabilitationValid(isAccepted && !isExpired);
      } catch (err) {
        console.error("Error fetching habilitation status", err);
        setIsHabilitationValid(false);
      } finally {
        Object.assign(OpenAPI, { TOKEN: null });
      }
    };

    const fetchPendingSignalementsCount = async () => {
      try {
        const paginatedSignalements = await SignalementsService.getSignalements(
          1,
          undefined,
          [Signalement.status.PENDING],
          undefined,
          undefined,
          [baseLocale.commune]
        );
        setPendingSignalementsCount(paginatedSignalements.total);
      } catch (err) {
        console.error("Error fetching pending signalements count", err);
        setPendingSignalementsCount(0);
      }
    };

    fetchCommune();
    fetchCommuneFlag();
    fetchIsHabilitationValid();
    if (canFetchSignalements(baseLocale, baseLocale.token)) {
      fetchPendingSignalementsCount();
    }
  }, [baseLocale]);

  const majDate = formatDistanceToNow(new Date(updatedAt), { locale: fr });

  const canHardDelete =
    status === ExtendedBaseLocaleDTO.status.DRAFT ||
    status === ExtendedBaseLocaleDTO.status.DEMO;

  return (
    <Card
      position="relative"
      display="flex"
      flexDirection="column"
      width={290}
      height={400}
      border
      elevation={2}
      margin={12}
    >
      {Boolean(pendingSignalementsCount) && (
        <Pane position="absolute" top={0} left={0}>
          <Pulsar size={16} />
        </Pane>
      )}
      <Pane position="absolute" top={16} left={16} height={20} elevation={2}>
        <StatusBadge
          status={status}
          sync={sync}
          isHabilitationValid={isHabilitationValid}
        />
      </Pane>
      {isHabilitationValid && commune && (
        <Pane
          position="absolute"
          top={10}
          right={10}
          elevation={2}
          padding={5}
          borderRadius="50%"
          backgroundColor="white"
        >
          <HabilitationTag
            communeName={commune.nom}
            isHabilitationValid={isHabilitationValid}
          />
        </Pane>
      )}
      <Pane
        height={100}
        flexShrink={0}
        backgroundImage={`url(${flag})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        marginTop={50}
        marginX={10}
      />
      <Pane
        padding={10}
        flexGrow={1}
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
      >
        <Pane display="flex" flexDirection="column">
          <Heading is="h2" size={600}>
            {nom}
          </Heading>
          <Text fontSize={12} fontStyle="italic">
            {updatedAt
              ? "Dernière mise à jour il y a " + majDate
              : "Jamais mise à jour"}{" "}
          </Text>
          {commune && (
            <Link
              href={`${ADRESSE_URL}/commune/${commune.code}`}
              target="_blank"
              rel="noopener noreferrer"
              fontSize={12}
              fontStyle="italic"
              textDecoration="underline"
            >
              Voir la page de {commune.nom}
            </Link>
          )}
        </Pane>
        <Pane display="flex" flexDirection="column">
          <Pane marginTop={5} display="flex">
            <Text display="block" marginRight={5}>
              Adresses certifiées :
            </Text>
            <CertificationCount
              nbNumeros={nbNumeros}
              nbNumerosCertifies={nbNumerosCertifies}
            />
          </Pane>
          {Boolean(pendingSignalementsCount) && (
            <Pane marginTop={5} display="flex" position="relative">
              <Text display="block" marginRight={5}>
                Signalements en attente :
              </Text>
              <Text fontWeight="bold" whiteSpace="nowrap">
                {pendingSignalementsCount}
              </Text>
            </Pane>
          )}
        </Pane>
      </Pane>
      <Pane
        width="100%"
        height={50}
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderTop="1px solid #E4E7EB"
      >
        {canHardDelete && (
          <Button
            intent="danger"
            onClick={onRemove}
            border="0"
            flexShrink={0}
            height="100%"
            borderRight="1px solid #E4E7EB"
            title="Supprimer la Base Adresse Locale"
          >
            <Icon icon={TrashIcon} />
          </Button>
        )}
        {!canHardDelete && (
          <Button
            onClick={onRemove}
            border="0"
            flexShrink={0}
            height="100%"
            borderRight="1px solid #E4E7EB"
            title="Masquer la Base Adresse Locale"
          >
            <Icon icon={EyeOffIcon} />
          </Button>
        )}
        <Button
          is={NextLink}
          href={`/bal/${id}`}
          border="0"
          flexGrow={1}
          height="100%"
          title="Accéder à la Base Adresse Locale"
        >
          <Icon icon={ArrowRightIcon} color="info" />
        </Button>
      </Pane>
    </Card>
  );
}

export default BaseLocaleCard;
