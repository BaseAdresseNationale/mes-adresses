import {
  Alert,
  Button,
  ListItem,
  OrderedList,
  Pane,
  Paragraph,
  Text,
} from "evergreen-ui";

import StatusBadge from "@/components/status-badge";
import Tuto from "@/components/help/tuto";
import Unauthorized from "@/components/help/tuto/unauthorized";
import Problems from "@/components/help/help-tabs/problems";
import {
  VideoContainer,
  PEERTUBE_LINK,
} from "@/components/help/video-container";
import { BaseLocale, BaseLocaleSync } from "@/lib/openapi-api-bal";

function Publication() {
  return (
    <Pane>
      <VideoContainer
        title="Publication de votre Base Adresse Locale :"
        link={`${PEERTUBE_LINK}/w/oMKnhiVycDTjddCBXZuYMB`}
      />
      <Tuto title="Publier sa Base Adresse Locale">
        <OrderedList margin={8}>
          <ListItem>
            <Paragraph>
              Cliquez sur le bouton
              <Button marginX={4} height={24} appearance="primary">
                Publier
              </Button>
            </Paragraph>
          </ListItem>

          <ListItem>
            <Paragraph>
              Authentifiez-vous via le courriel officiel de la mairie ou a votre
              compte Proconnect
            </Paragraph>
          </ListItem>

          <ListItem>
            Une fois l’habilitation obtenue, vous serez automatiquement invité à
            publier votre Base Adresse Locale en cliquant sur
            <Button
              marginX={4}
              height={24}
              appearance="primary"
              intent="success"
            >
              Publier
            </Button>
          </ListItem>
        </OrderedList>
        <Alert title="En cas de conflit">
          <Text display="block" color="muted">
            Il peut arriver qu’une autre Base Adresse Locale soit déjà
            synchronisée avec la Base Adresse Nationale. Dans ce cas, votre Base
            Adresse Locale va entrer en conflit avec celle-ci.
          </Text>
          <Text display="block" marginTop={8} color="muted">
            En cliquant sur
            <Button
              appearance="primary"
              intent="danger"
              height={24}
              marginX={4}
            >
              Forcer la publication
            </Button>
            votre Base Adresse Locale sera publiée et remplacera celle
            actuellement en place.
          </Text>
        </Alert>
      </Tuto>

      <Tuto title="Statuts de synchronisation">
        <Pane display="flex" flexDirection="column" gap={16} marginTop={8}>
          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: false, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>
              Votre Base Adresse Locale est à jour avec la Base Adresse
              Nationale. Toutes ses adresses sont prises en compte.
            </Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{
                  isPaused: false,
                  status: BaseLocaleSync.status.OUTDATED,
                }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>
              Des modifications ont été détectées, elles seront automatiquement
              répercutées dans la Base Adresse Nationale dans les prochaines
              heures.
            </Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{ isPaused: true, status: BaseLocaleSync.status.SYNCED }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>
              Vous avez suspendus les mises à jour de votre Base Adresse Locale.
              Aucune modification ne sera transmise à la Base Adresse Nationale.
              Vous pouvez relancer les mises à jours à tout moment.
            </Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={32} marginTop={4}>
              <StatusBadge
                status={BaseLocale.status.REPLACED}
                sync={{
                  isPaused: true,
                  status: BaseLocaleSync.status.CONFLICT,
                }}
                isHabilitationValid={true}
              />
            </Pane>
            <Text>
              Une autre Base Adresse Locale a remplacé la votre, impossible de
              mettre à jour automatiquement vos adresses. Vous pouvez forcer la
              mise à jour afin de remplacer la Base Adresse Locale actuellement
              en place.
            </Text>
          </Pane>

          <Pane display="grid" gridTemplateColumns="160px 1fr" gap={8}>
            <Pane height={38}>
              <StatusBadge
                status={BaseLocale.status.PUBLISHED}
                sync={{
                  isPaused: false,
                  status: BaseLocaleSync.status.OUTDATED,
                }}
                isHabilitationValid={false}
              />
            </Pane>
            <Text>
              L&apos;habilitation de la Base Adresse Locale n&apos;est pas
              valide. Il vous faut renouveler celle-ci pour que les nouvelles
              modifications remontent dans la Base Adresse Nationale.
            </Text>
          </Pane>
        </Pane>
      </Tuto>

      <Problems>
        <Unauthorized title="Je n’arrive pas à éditer ma BAL" />
      </Problems>
    </Pane>
  );
}

export default Publication;
