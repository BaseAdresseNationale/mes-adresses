import { Report, Signalement, Source } from "@/lib/openapi-signalement";
import {
  Table,
  Popover,
  Menu,
  Position,
  IconButton,
  MoreIcon,
  SendToMapIcon,
  TrashIcon,
  Checkbox,
  Icon,
  TickCircleIcon,
  BanCircleIcon,
  Tooltip,
  Text,
  Strong,
  Pane,
} from "evergreen-ui";
import SignalementTypeBadge from "./signalement-type-badge";
import Image from "next/image";

interface SignalementListItemProps {
  signalement: Report & { label: string };
  editionEnabled?: boolean;
  onToggleSelect: (ids: string[]) => void;
  selectedSignalements: string[];
  onHoverEnter: (id: string) => void;
  onHoverLeave: (id: string) => void;
  onSelect: (id: string) => void;
  onIgnore: (id: string) => void;
}

export function SignalementListItem({
  signalement,
  editionEnabled,
  selectedSignalements,
  onToggleSelect,
  onHoverEnter,
  onHoverLeave,
  onSelect,
  onIgnore,
}: SignalementListItemProps) {
  return (
    <Table.Row
      key={signalement.id}
      paddingRight={8}
      minHeight={64}
      maxHeight={64}
    >
      <Table.Cell flex="0 1 40px">
        {editionEnabled ? (
          <Checkbox
            checked={selectedSignalements.includes(signalement.id)}
            onChange={() => onToggleSelect([signalement.id])}
          />
        ) : signalement.status === Signalement.status.IGNORED ? (
          <Tooltip
            content={`Refusée le ${new Date(
              signalement.updatedAt
            ).toLocaleDateString("fr-FR")}`}
          >
            <Icon icon={BanCircleIcon} color="red500" />
          </Tooltip>
        ) : signalement.status === Signalement.status.PROCESSED ? (
          <Tooltip
            content={`Acceptée le ${new Date(
              signalement.updatedAt
            ).toLocaleDateString("fr-FR")}`}
          >
            <Icon icon={TickCircleIcon} color="green500" />
          </Tooltip>
        ) : null}
      </Table.Cell>
      {editionEnabled && (
        <Table.Cell flex="0 1 40px">
          {signalement.source.type === Source.type.PRIVATE ? (
            <Tooltip
              content={
                <>
                  <Strong color="white" is="div">
                    {signalement.source.nom}
                  </Strong>
                  <Text color="white">Acteur de confiance</Text>
                </>
              }
            >
              <Image
                src="/static/images/signalement/source-service-public.svg"
                alt="Icône source service public"
                width={20}
                height={20}
              />
            </Tooltip>
          ) : (
            <Tooltip
              content={
                <>
                  <Strong color="white" is="div">
                    {signalement.source.nom}
                  </Strong>
                  <Text color="white">Source grand public</Text>
                </>
              }
            >
              <Image
                src="/static/images/signalement/source-grand-public.svg"
                alt="Icône source grand public"
                width={20}
                height={20}
              />
            </Tooltip>
          )}
        </Table.Cell>
      )}
      <Table.TextCell
        flex="2"
        className="main-table-cell"
        onMouseEnter={() => onHoverEnter(signalement.id)}
        onMouseLeave={() => onHoverLeave(signalement.id)}
        onClick={() => onSelect(signalement.id)}
        cursor="pointer"
      >
        <Pane>
          <SignalementTypeBadge type={signalement.type} />
        </Pane>
        <Pane marginTop={4} marginLeft={4}>
          {signalement.label}
        </Pane>
      </Table.TextCell>
      {editionEnabled && (
        <Table.Cell flex="0 1 40px">
          <Popover
            position={Position.BOTTOM_LEFT}
            content={
              <Menu>
                <Menu.Group>
                  <Menu.Item
                    icon={SendToMapIcon}
                    onSelect={() => onSelect(signalement.id)}
                  >
                    Traiter
                  </Menu.Item>
                  <Menu.Item
                    icon={TrashIcon}
                    intent="danger"
                    onSelect={() => onIgnore(signalement.id)}
                  >
                    Ignorer
                  </Menu.Item>
                </Menu.Group>
              </Menu>
            }
          >
            <IconButton
              type="button"
              height={24}
              icon={MoreIcon}
              appearance="minimal"
            />
          </Popover>
        </Table.Cell>
      )}
    </Table.Row>
  );
}
