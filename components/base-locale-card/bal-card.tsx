import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Card,
  Pane,
  Link,
  Heading,
  Text,
  IconButton,
  EyeOffIcon,
  TrashIcon,
  ArrowRightIcon,
  Pulsar,
  Button,
  Icon,
} from "evergreen-ui";
import NextLink from "next/link";
import { format } from "date-fns";
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
  userEmail?: string;
  onRemove?: (e: any) => void;
  onHide?: (e: any) => void;
  isShownHabilitationStatus?: boolean;
}

function BaseLocaleCard({
  baseLocaleWithInfos,
  isAdmin,
  userEmail,
  isShownHabilitationStatus,
  onRemove,
  onHide,
}: BaseLocaleCardProps) {
  const {
    id,
    status,
    sync,
    nom,
    updatedAt,
    createdAt,
    flag,
    isHabilitationValid,
    commune,
    pendingSignalementsCount,
    nbNumeros,
    nbNumerosCertifies,
  } = baseLocaleWithInfos;

  const majDate = formatDistanceToNow(new Date(updatedAt), { locale: fr });
  const createDate = format(new Date(createdAt), "PPP", { locale: fr });

  const isDeletable =
    status === ExtendedBaseLocaleDTO.status.DRAFT ||
    status === ExtendedBaseLocaleDTO.status.DEMO;
  const tooltipContent =
    "Vous ne pouvez pas supprimer une Base Adresse Locale qui est publiée. Si vous souhaitez la dé-publier, veuillez contacter le support adresse@data.gouv.fr";

  return (
    <Card
      display="flex"
      flexDirection="column"
      width={290}
      height={460}
      border
      elevation={2}
      margin={12}
    >
      <Pane
        position="relative"
        width="100%"
        height={160}
        flexShrink={0}
        backgroundImage={`url(${flag})`}
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="contain"
        marginTop={6}
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
        <Pane
          position="absolute"
          top={10}
          right={10}
          elevation={2}
          padding={5}
          borderRadius="50%"
        >
          <HabilitationTag
            communeName={commune.nom}
            isHabilitationValid={isHabilitationValid}
          />
        </Pane>
      </Pane>
      <Pane
        padding={10}
        marginTop={20}
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
            fontStyle="italic"
          >
            {commune.nom}{" "}
            {commune.codeDepartement ? `(${commune.codeDepartement})` : ""}
          </Link>
        </Pane>
        <Pane display="flex" flexDirection="column">
          <Pane marginTop={5} display="flex">
            <Text display="block" marginRight={5}>
              Créée le :
            </Text>
            <Text fontWeight="bold" whiteSpace="nowrap">
              {createDate}
            </Text>
          </Pane>
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
        <Button
          intent="danger"
          onClick={onRemove}
          border={0}
          flexGrow={1}
          height="100%"
          borderRight="1px solid #E4E7EB"
        >
          <Icon icon={TrashIcon} />
        </Button>
        <Button
          onClick={onHide}
          border={0}
          flexGrow={1}
          height="100%"
          borderRight="1px solid #E4E7EB"
        >
          <Icon icon={EyeOffIcon} />
        </Button>
        <Button
          is={NextLink}
          href={`/bal/${id}`}
          border={0}
          flexGrow={1}
          height="100%"
        >
          <Icon icon={ArrowRightIcon} color="info" />
        </Button>
      </Pane>
    </Card>
  );
}

export default BaseLocaleCard;
