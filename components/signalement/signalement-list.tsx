import { useMemo } from "react";
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
} from "evergreen-ui";

import useFuse from "@/hooks/fuse";

import InfiniteScrollList from "../infinite-scroll-list";
import { getSignalementLabel } from "@/lib/utils/signalement";

interface SignalementListProps {
  signalements: any[];
  selectedSignalements: string[];
  setSelectedSignalements: (ids: string[]) => void;
  onSelect: (id: string) => void;
  onIgnore: (id: string) => void;
  onToggleSelect: (ids: string[]) => void;
}

function SignalementList({
  signalements,
  selectedSignalements,
  setSelectedSignalements,
  onSelect,
  onIgnore,
  onToggleSelect,
}: SignalementListProps) {
  const signalementWithLabel = useMemo(
    () => signalements.map((s) => ({ ...s, label: getSignalementLabel(s) })),
    [signalements]
  );

  const [signalementsList, setSignalementsList] = useFuse(
    signalementWithLabel,
    200,
    {
      keys: ["label"],
    }
  );

  const isAllSelected = useMemo(() => {
    const isAllSignalementsSelected =
      signalementsList.length === selectedSignalements.length &&
      signalementsList.length > 0;

    return isAllSignalementsSelected;
  }, [selectedSignalements, signalementsList]);

  return (
    <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
      <Table.Head>
        <Table.Cell flex="0 1 1">
          <Checkbox
            checked={isAllSelected}
            onChange={() =>
              setSelectedSignalements(
                isAllSelected ? [] : signalements.map(({ id }) => id)
              )
            }
          />
        </Table.Cell>
        <Table.SearchHeaderCell
          placeholder="Rechercher un signalement"
          onChange={setSignalementsList}
        />
      </Table.Head>

      {signalementsList.length === 0 && (
        <Table.Row>
          <Table.TextCell color="muted" fontStyle="italic">
            Aucun résultat
          </Table.TextCell>
        </Table.Row>
      )}

      <InfiniteScrollList items={signalementsList}>
        {(signalement) => (
          <Table.Row key={signalement.id} paddingRight={8} minHeight={48}>
            <Table.Cell flex="0 1 40px">
              <Checkbox
                checked={selectedSignalements.includes(signalement.id)}
                onChange={() => onToggleSelect([signalement.id])}
              />
            </Table.Cell>
            <Table.TextCell flex="2">{signalement.label}</Table.TextCell>
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
          </Table.Row>
        )}
      </InfiniteScrollList>
    </Table>
  );
}

export default SignalementList;
