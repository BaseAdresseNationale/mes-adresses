import { useMemo } from "react";
import { sortBy } from "lodash";
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

import { normalizeSort } from "@/lib/normalize";

import useFuse from "@/hooks/fuse";

import InfiniteScrollList from "../infinite-scroll-list";
import { getSignalementLabel } from "@/lib/utils/signalement";

interface SignalementListProps {
  signalements: any[];
  selectedSignalements: string[];
  onSelect: (id: string) => void;
  onIgnore: (id: string) => void;
  onToggleSelect: (ids: string[]) => void;
}

function SignalementList({
  signalements,
  selectedSignalements,
  onSelect,
  onIgnore,
  onToggleSelect,
}: SignalementListProps) {
  const signalementWithLabel = useMemo(
    () => signalements.map((s) => ({ ...s, label: getSignalementLabel(s) })),
    [signalements]
  );

  const [filtered, setFilter] = useFuse(signalementWithLabel, 200, {
    keys: ["label"],
  });

  const scrollableItems = useMemo(
    () => sortBy(filtered, (s) => normalizeSort(s.label)),
    [filtered]
  );

  const isAllSelected = useMemo(() => {
    const isAllSignalementsSelected =
      filtered.length === selectedSignalements.length && filtered.length > 0;

    return isAllSignalementsSelected;
  }, [selectedSignalements, filtered]);

  return (
    <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
      <Table.Head>
        <Table.Cell flex="0 1 1">
          <Checkbox
            checked={isAllSelected}
            onChange={() =>
              onToggleSelect(
                isAllSelected ? [] : signalements.map(({ _id }) => _id)
              )
            }
          />
        </Table.Cell>
        <Table.SearchHeaderCell
          placeholder="Rechercher un signalement"
          onChange={setFilter}
        />
      </Table.Head>

      {filtered.length === 0 && (
        <Table.Row>
          <Table.TextCell color="muted" fontStyle="italic">
            Aucun résultat
          </Table.TextCell>
        </Table.Row>
      )}

      <InfiniteScrollList items={scrollableItems}>
        {(signalement) => (
          <Table.Row key={signalement._id} paddingRight={8} minHeight={48}>
            <Table.Cell flex="0 1 40px">
              <Checkbox
                checked={selectedSignalements.includes(signalement._id)}
                onChange={() => onToggleSelect([signalement._id])}
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
                        onSelect={() => onSelect(signalement._id)}
                      >
                        Traiter
                      </Menu.Item>
                      <Menu.Item
                        icon={TrashIcon}
                        intent="danger"
                        onSelect={() => onIgnore(signalement._id)}
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
