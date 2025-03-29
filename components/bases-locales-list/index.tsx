import { useState, useCallback, useContext, useEffect } from "react";
import { Pane, Paragraph, SearchInput } from "evergreen-ui";
import { sortBalByUpdate } from "@/lib/utils/sort-bal";
import LocalStorageContext from "@/contexts/local-storage";
import useFuse from "@/hooks/fuse";
import DeleteWarning from "@/components/delete-warning";
import BaseLocaleCard from "@/components/base-locale-card/bal-card";
import { ExtendedBaseLocaleDTO } from "@/lib/openapi-api-bal";
import { fetchBALInfos } from "@/lib/utils/bal";

interface BasesLocalesListProps {
  basesLocales: ExtendedBaseLocaleDTO[];
}

export type BasesLocalesWithInfos = ExtendedBaseLocaleDTO &
  Awaited<ReturnType<typeof fetchBALInfos>>;

const fuseOptions = {
  keys: ["nom", "commune"],
};

function BasesLocalesList({ basesLocales }: BasesLocalesListProps) {
  const [basesLocalesWithInfos, setBasesLocalesWithInfos] = useState<
    BasesLocalesWithInfos[]
  >([]);
  const { removeBAL, getHiddenBal, addHiddenBal } =
    useContext(LocalStorageContext);
  const [toRemove, setToRemove] = useState(null);

  useEffect(() => {
    async function addBALInfos() {
      const balWithInfos = await Promise.all(
        basesLocales.map(async (baseLocale) => {
          const balInfos = await fetchBALInfos(baseLocale);

          return {
            ...baseLocale,
            ...balInfos,
          } as BasesLocalesWithInfos;
        })
      );

      setBasesLocalesWithInfos(balWithInfos);
    }

    void addBALInfos();
  }, [basesLocales]);

  const [filtered, onFilter] = useFuse(basesLocalesWithInfos, 200, fuseOptions);

  const isHidden = useCallback(
    (balId) => {
      return getHiddenBal(balId);
    },
    [getHiddenBal]
  );

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
        <Pane padding={16}>
          <SearchInput
            onChange={onFilter}
            placeholder="Rechercher une Base Adresse Locale"
          />
        </Pane>
        <Pane
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(20rem, 1fr))"
          gap={8}
          justifyItems="center"
          alignItems="center"
        >
          {filtered.length > 0
            ? sortBalByUpdate(filtered)
                .filter(({ id }) => Boolean(!isHidden(id)))
                .map((bal) => (
                  <BaseLocaleCard
                    key={bal.id}
                    isAdmin
                    baseLocaleWithInfos={bal}
                    onRemove={(e) => handleRemove(e, bal.id)}
                    onHide={(e) => handleHide(e, bal.id)}
                    isShownHabilitationStatus
                  />
                ))
            : "Aucun résultat"}
        </Pane>
      </Pane>
    )
  );
}

export default BasesLocalesList;
