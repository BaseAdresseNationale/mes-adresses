import React from "react";
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
import { BasesLocalesWithInfos } from "../bases-locales-list";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import CertificationCount from "../certification-count";
import HabilitationTag from "../habilitation-tag";

const ADRESSE_URL =
  process.env.NEXT_PUBLIC_ADRESSE_URL || "https://adresse.data.gouv.fr";

interface BaseLocaleCardProps {
  baseLocaleWithInfos: BasesLocalesWithInfos;
  isAdmin?: boolean;
  onRemove: () => void;
  isShownHabilitationStatus?: boolean;
}

function BaseLocaleCard({
  baseLocaleWithInfos,
  isAdmin,
  isShownHabilitationStatus,
  onRemove,
}: BaseLocaleCardProps) {
  const {
    id,
    status,
    sync,
    nom,
    updatedAt,
    flag,
    isHabilitationValid,
    commune,
    pendingSignalementsCount,
    nbNumeros,
    nbNumerosCertifies,
  } = baseLocaleWithInfos;

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
      {isHabilitationValid && isShownHabilitationStatus && (
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
        {isAdmin && canHardDelete && (
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
        {isAdmin && !canHardDelete && (
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
