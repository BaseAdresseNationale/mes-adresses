import { useContext, useMemo, useState } from "react";
import {
  Table,
  Checkbox,
  Button,
  FilterRemoveIcon,
  FilterIcon,
  Tooltip,
  Pane,
} from "evergreen-ui";

import InfiniteScrollList from "../infinite-scroll-list";
import { Signalement } from "@/lib/openapi-signalement";
import SignalementTypeBadge from "./signalement-type-badge";
import MarkersContext from "@/contexts/markers";
import { SignalementListItem } from "./signalement-list-item";

interface SignalementListProps {
  signalements: Signalement[];
  selectedSignalements: string[];
  setSelectedSignalements: (ids: string[]) => void;
  onSelect: (id: string) => void;
  onIgnore: (id: string) => Promise<void>;
  onToggleSelect: (ids: string[]) => void;
  filters: {
    type: Signalement.type[];
  };
  setFilters: (filters: { type: Signalement.type[] }) => void;
  onSearch?: (search: string) => void;
  editionEnabled?: boolean;
}

function SignalementList({
  signalements,
  selectedSignalements,
  setSelectedSignalements,
  onSelect,
  onIgnore,
  onToggleSelect,
  filters,
  setFilters,
  onSearch,
  editionEnabled,
}: SignalementListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const { updateMarker } = useContext(MarkersContext);

  const hasActiveFilters = useMemo(
    () =>
      Object.keys(filters).reduce((acc, cur) => {
        return acc || filters[cur].length > 0;
      }, false),
    [filters]
  );

  const isAllSelected = useMemo(() => {
    const isAllSignalementsSelected =
      signalements.length === selectedSignalements.length &&
      signalements.length > 0;

    return isAllSignalementsSelected;
  }, [selectedSignalements, signalements]);

  const onHoverEnter = (id: string) => {
    updateMarker(id, { showTooltip: true });
  };

  const onHoverLeave = (id: string) => {
    updateMarker(id, { showTooltip: false });
  };

  return (
    <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
      <Table.Head>
        {editionEnabled && (
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
        )}
        <Table.SearchHeaderCell
          placeholder="Rechercher un signalement"
          onChange={onSearch}
        />
        <Table.HeaderCell flex="unset">
          <Tooltip
            content={
              <Pane margin={10}>
                {Object.values(Signalement.type).map((type) => (
                  <Checkbox
                    key={type}
                    label={<SignalementTypeBadge type={type} />}
                    checked={filters.type.includes(type)}
                    onChange={() =>
                      setFilters({
                        type: filters.type.includes(type)
                          ? filters.type.filter((t) => t !== type)
                          : [...filters.type, type],
                      })
                    }
                  />
                ))}
              </Pane>
            }
            appearance="card"
            isShown={showFilters}
          >
            <Button
              className="filter-button"
              size="small"
              iconBefore={hasActiveFilters ? FilterRemoveIcon : FilterIcon}
              onClick={() => setShowFilters((prev) => !prev)}
            >
              Filtres
            </Button>
          </Tooltip>
          {showFilters && (
            <Pane
              position="fixed"
              zIndex={1}
              top={0}
              left={0}
              height="100vh"
              width="100vw"
              onClick={() => setShowFilters(false)}
            />
          )}
        </Table.HeaderCell>
      </Table.Head>

      {signalements.length === 0 && (
        <Table.Row>
          <Table.TextCell marginLeft={40} color="muted" fontStyle="italic">
            Vous n&apos;avez aucune proposition actuellement
          </Table.TextCell>
        </Table.Row>
      )}

      <InfiniteScrollList items={signalements}>
        {(signalement: Signalement & { label: string }) => (
          <SignalementListItem
            key={signalement.id}
            signalement={signalement}
            editionEnabled={editionEnabled}
            selectedSignalements={selectedSignalements}
            onToggleSelect={onToggleSelect}
            onHoverEnter={onHoverEnter}
            onHoverLeave={onHoverLeave}
            onSelect={onSelect}
            onIgnore={onIgnore}
          />
        )}
      </InfiniteScrollList>
    </Table>
  );
}

export default SignalementList;
