import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { sortBy } from "lodash";
import { Pane, Heading, Table, Checkbox } from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";

import useFuse from "@/hooks/fuse";

import InfiniteScrollList from "@/components/infinite-scroll-list";
import RowNumeroDeleted from "@/components/trash/restore-voie/row-numero-deleted";
import { Numero } from "@/lib/openapi-api-bal";

interface ListNumerosDeletedProps {
  numeros: Numero[];
  selectedNumerosIds: string[];
  setSelectedNumerosIds: Dispatch<SetStateAction<string[]>>;
}

const fuseOptions = {
  keys: ["numero"],
};

function ListNumerosDeleted({
  numeros,
  selectedNumerosIds,
  setSelectedNumerosIds,
}: ListNumerosDeletedProps) {
  const [filtered, setFilter] = useFuse(numeros, 200, fuseOptions);

  const scrollableItems = useMemo(
    () =>
      sortBy(filtered, (n) => {
        normalizeSort(String(n.numero));
      }),
    [filtered]
  );

  const noFilter = numeros && filtered.length === numeros.length;

  const isAllSelected = useMemo(() => {
    const isAllNumerosSelected =
      noFilter && selectedNumerosIds.length === numeros.length;
    const isAllFilteredNumerosSelected =
      !noFilter &&
      filtered.length === selectedNumerosIds.length &&
      filtered.length > 0;

    return isAllNumerosSelected || isAllFilteredNumerosSelected;
  }, [numeros, noFilter, selectedNumerosIds, filtered]);

  const handleSelect = useCallback(
    (id) => {
      setSelectedNumerosIds((selectedNumero) => {
        if (selectedNumero.includes(id)) {
          return selectedNumerosIds.filter((f) => f !== id);
        }

        return [...selectedNumerosIds, id];
      });
    },
    [selectedNumerosIds, setSelectedNumerosIds]
  );

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedNumerosIds([]);
    } else {
      setSelectedNumerosIds(filtered.map(({ id }) => id));
    }
  };

  return (
    <>
      <Pane
        flexShrink={0}
        elevation={0}
        backgroundColor="white"
        padding={16}
        display="flex"
        alignItems="center"
        minHeight={64}
      >
        <Pane>
          <Heading>Liste des numéros supprimés</Heading>
        </Pane>
      </Pane>

      <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
        <Table.Head>
          {numeros && (
            <Table.Cell flex="0 1 1">
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
            </Table.Cell>
          )}
          <Table.SearchHeaderCell
            placeholder="Rechercher un numéro"
            onChange={setFilter}
          />
        </Table.Head>

        {filtered.length === 0 && (
          <Table.Row>
            <Table.TextCell color="muted" fontStyle="italic">
              Aucun numéro
            </Table.TextCell>
          </Table.Row>
        )}

        <InfiniteScrollList items={scrollableItems}>
          {(numero) => (
            <RowNumeroDeleted
              key={String(numero.id)}
              label={`${numero.numeroComplet}`}
              secondary={
                numero.positions.length > 1
                  ? `${numero.positions.length} positions`
                  : null
              }
              handleSelect={() => handleSelect(numero.id)}
              isSelected={selectedNumerosIds.includes(numero.id)}
            />
          )}
        </InfiniteScrollList>
      </Table>
    </>
  );
}

export default ListNumerosDeleted;
