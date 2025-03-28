import { useMemo } from "react";
import { sortBy } from "lodash";
import { Table, AddIcon, TrashIcon } from "evergreen-ui";

import { normalizeSort } from "@/lib/normalize";

import useFuse from "@/hooks/fuse";

import TableRowDeleted from "@/components/trash/table-row-deleted/index";
import InfiniteScrollList from "@/components/infinite-scroll-list";

interface ItemsListDeleteProps {
  itemsDeleted: any[];
  model: string;
  onRestore: (item: any) => void;
  onRemove: (item: any) => void;
  onRemoveNumeros?: (item: any) => void;
}

const fuseOptions = { keys: ["nom"] };

function ItemsListDelete({
  itemsDeleted,
  model,
  onRestore,
  onRemove,
  onRemoveNumeros,
}: ItemsListDeleteProps) {
  const [filtered, setFilter] = useFuse(itemsDeleted, 200, fuseOptions);

  const scrollableItems = useMemo(
    () => sortBy(filtered, (v) => normalizeSort(v.nom)),
    [filtered]
  );

  const actions = (item) => {
    const actions = [
      {
        label:
          model === "voie"
            ? item.deletedAt
              ? "Restaurer voie"
              : "Voir numero(s)"
            : "Restaurer toponyme",
        callback: () => onRestore(item),
        icon: AddIcon,
        intent: "none",
      },
      {
        label: "Supprimer",
        callback: () =>
          item.deletedAt ? onRemove(item) : onRemoveNumeros(item),
        icon: TrashIcon,
        intent: "danger",
      },
    ];
    return actions;
  };

  const complement = (item) => {
    if (model === "voie" && item.numeros) {
      if (item.deletedAt) {
        return (
          "voie" +
          (item.numeros.length > 0
            ? " et " + item.numeros.length + " numero(s) supprimée(s)"
            : "")
        );
      }

      return item.numeros.length > 0
        ? item.numeros.length + " numero(s) supprimée(s)"
        : "";
    }

    return null;
  };

  return (
    <Table display="flex" flex={1} flexDirection="column" overflowY="auto">
      <Table.Head>
        <Table.SearchHeaderCell
          placeholder={`Rechercher une ${model}`}
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
        {(item) => (
          <TableRowDeleted
            key={item.id}
            label={item.nom}
            nomAlt={item.nomAlt}
            complement={complement(item)}
            isDeleted={item.deletedAt !== null}
            actions={actions(item)}
          />
        )}
      </InfiniteScrollList>
    </Table>
  );
}

export default ItemsListDelete;
