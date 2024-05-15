import { useState, useCallback, useContext } from "react";
import Router from "next/router";
import { Pane, Table, Paragraph } from "evergreen-ui";

import { sortBalByUpdate } from "@/lib/sort-bal";

import LocalStorageContext from "@/contexts/local-storage";

import useFuse from "@/hooks/fuse";

import DeleteWarning from "@/components/delete-warning";
import BaseLocaleCard from "@/components/base-locale-card";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi";

interface BasesLocalesListProps {
  basesLocales: ExtendedBaseLocaleDTO[];
}

function BasesLocalesList({ basesLocales }: BasesLocalesListProps) {
  const { removeBAL, getHiddenBal, addHiddenBal } =
    useContext(LocalStorageContext);

  const [toRemove, setToRemove] = useState(null);

  const isHidden = useCallback(
    (balId) => {
      return getHiddenBal(balId);
    },
    [getHiddenBal]
  );

  const onBalSelect = (bal) => {
    Router.push(`/bal/${bal._id}`);
  };

  const [filtered, onFilter] = useFuse(basesLocales, 200, {
    keys: ["nom", "commune"],
  });

  const onRemove = useCallback(async () => {
    await removeBAL(toRemove);
    setToRemove(null);
  }, [toRemove, removeBAL]);

  const handleRemove = useCallback((e, balId) => {
    e.stopPropagation();

    setToRemove(balId);
  }, []);

  const handleHide = useCallback(
    (e, balId) => {
      e.stopPropagation();

      addHiddenBal(balId, true);
    },
    [addHiddenBal]
  );

  return (
    basesLocales.length > 0 && (
      <Pane borderTop>
        <DeleteWarning
          isShown={Boolean(toRemove)}
          content={
            <Paragraph>
              Êtes vous bien sûr de vouloir supprimer cette Base Adresse Locale
              ? Cette action est définitive.
            </Paragraph>
          }
          onCancel={() => setToRemove(null)}
          onConfirm={onRemove}
        />

        <Table>
          <Table.Head>
            <Table.SearchHeaderCell
              placeholder="Rechercher une Base Adresse Locale"
              onChange={onFilter}
            />
          </Table.Head>
          {filtered.length === 0 && (
            <Table.Row>
              <Table.TextCell color="muted" fontStyle="italic">
                Aucun résultat
              </Table.TextCell>
            </Table.Row>
          )}
          <Table.Body background="tint1">
            {sortBalByUpdate(filtered)
              .filter(({ _id }) => Boolean(!isHidden(_id)))
              .map((bal) => (
                <BaseLocaleCard
                  key={bal._id}
                  isAdmin
                  baseLocale={bal}
                  isDefaultOpen={basesLocales.length === 1}
                  onSelect={() => onBalSelect(bal)}
                  onRemove={(e) => handleRemove(e, bal._id)}
                  onHide={(e) => handleHide(e, bal._id)}
                  isShownHabilitationStatus
                />
              ))}
          </Table.Body>
        </Table>
      </Pane>
    )
  );
}

export default BasesLocalesList;
