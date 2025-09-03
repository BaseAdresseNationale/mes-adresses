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
  Icon,
} from "evergreen-ui";
import NextLink from "next/link";
import StatusBadge from "@/components/status-badge";
import {
  ExtendedBaseLocaleDTO,
  HabilitationService,
} from "@/lib/openapi-api-bal";
import CertificationCount from "../certification-count";
import HabilitationTag from "../habilitation-tag";
import { canFetchSignalements } from "@/lib/utils/signalement";
import { Signalement, SignalementsService } from "@/lib/openapi-signalement";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import styles from "./base-locale-card.module.css";
import { TabsEnum } from "../sidebar/main-tabs/main-tabs";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

interface BaseLocaleCardProps {
  baseLocale: ExtendedBaseLocaleDTO;
  onRemove: () => void;
}

function BaseLocaleCard({ baseLocale, onRemove }: BaseLocaleCardProps) {
  const [pendingSignalementsCount, setPendingSignalementsCount] = useState(0);
  const [flag, setFlag] = useState<string | null>(null);
  const {
    id,
    status,
    sync,
    nom,
    communeNom,
    commune: communeCode,
    updatedAt,
    nbNumeros,
    nbNumerosCertifies,
  } = baseLocale;

  useEffect(() => {
    const fetchCommuneFlag = async () => {
      try {
        const flagUrl = await getCommuneFlagProxy(baseLocale.commune);
        setFlag(flagUrl);
      } catch (err) {
        console.error("Error fetching commune flag", err);
        setFlag(null);
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

    fetchCommuneFlag();
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
      <Pane position="absolute" top={16} left={16} height={20} elevation={2}>
        <StatusBadge status={status} sync={sync} />
      </Pane>
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
          {communeNom && (
            <Link
              href={`${ADRESSE_URL}/commune/${communeCode}`}
              target="_blank"
              rel="noopener noreferrer"
              fontSize={12}
              fontStyle="italic"
              textDecoration="underline"
              width="fit-content"
            >
              Voir la page de {communeNom}
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
          {pendingSignalementsCount > 0 && (
            <Pane marginTop={5} display="flex">
              <Text display="block" marginRight={5}>
                Signalements en attente :
              </Text>
              <Text fontWeight="bold" whiteSpace="nowrap">
                {pendingSignalementsCount}
              </Text>
              <Pane marginLeft={35} position="relative">
                <Pulsar size={16} right={0} top={0} />
              </Pane>
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
          <button
            onClick={onRemove}
            className={`${styles["custom-button"]} ${styles["delete-button"]}`}
            title="Supprimer la Base Adresse Locale"
          >
            <Icon icon={TrashIcon} />
          </button>
        )}
        {!canHardDelete && (
          <button
            onClick={onRemove}
            className={`${styles["custom-button"]} ${styles["hide-button"]}`}
            title="Masquer la Base Adresse Locale"
          >
            <Icon icon={EyeOffIcon} />
          </button>
        )}
        <Pane borderLeft="1px solid #E6E8F0" height="100%" />

        <NextLink
          href={`/bal/${id}/${TabsEnum.VOIES}`}
          className={`${styles["custom-button"]} ${styles["manage-button"]}`}
          title="Accéder à la Base Adresse Locale"
        >
          <Text fontSize={16} fontWeight={300} color="inherit">
            Gérer les adresses
          </Text>
          <Icon marginLeft={10} icon={ArrowRightIcon} />
        </NextLink>
      </Pane>
    </Card>
  );
}

export default BaseLocaleCard;
