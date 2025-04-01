import {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Badge,
  Button,
  EyeOpenIcon,
  Icon,
  Pagination,
  Pane,
  Paragraph,
  SearchInput,
  Spinner,
} from "evergreen-ui";
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

const PAGE_SIZE = 8;

function BasesLocalesList({ basesLocales }: BasesLocalesListProps) {
  const baseLocalesWithInfosRef = useRef<
    Map<string, ExtendedBaseLocaleDTO | BasesLocalesWithInfos>
  >(
    basesLocales.reduce(
      (acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      },
      new Map() as Map<string, ExtendedBaseLocaleDTO | BasesLocalesWithInfos>
    )
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { removeBAL, addHiddenBal, hiddenBal } =
    useContext(LocalStorageContext);
  const [toRemove, setToRemove] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredBALs, onFilter] = useFuse(basesLocales, 200, fuseOptions);

  const balsToDisplay = useMemo(
    () =>
      filteredBALs
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        .map(({ id }) => id),
    [currentPage, filteredBALs]
  );

  useEffect(() => {
    async function addBALInfos() {
      try {
        setIsLoading(true);
        const balWithInfos = await Promise.all(
          balsToDisplay.map(async (id) => {
            const baseLocale = baseLocalesWithInfosRef.current[id];
            if ((baseLocale as BasesLocalesWithInfos).isLoaded) {
              return baseLocale;
            }

            const balInfos = await fetchBALInfos(baseLocale);
            return {
              ...baseLocale,
              ...balInfos,
            } as BasesLocalesWithInfos;
          })
        );

        baseLocalesWithInfosRef.current = {
          ...baseLocalesWithInfosRef.current,
          ...Object.fromEntries(balWithInfos.map((bal) => [bal.id, bal])),
        };
      } catch (error) {
        console.error("Error fetching BAL infos:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void addBALInfos();
  }, [balsToDisplay]);

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
      <Pane display="flex" flexDirection="column" height="100%">
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
        <Pane
          display="flex"
          flexWrap="wrap"
          gap={16}
          paddingX={32}
          paddingY={16}
          marginTop={12}
        >
          <SearchInput
            onChange={(e) => {
              onFilter(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher une Base Adresse Locale"
          />
          {Object.keys(hiddenBal).length > 0 && (
            <Button flexShrink={0} onClick={() => console.log("TODO")}>
              {Object.keys(hiddenBal).length > 1
                ? `Afficher les ${Object.keys(hiddenBal).length} BAL masquées`
                : `Afficher la BAL masquée`}
              <Icon marginLeft={5} icon={EyeOpenIcon} />
            </Button>
          )}
        </Pane>
        {isLoading ? (
          <Pane
            height="100%"
            display="flex"
            flex={1}
            alignItems="center"
            justifyContent="center"
          >
            <Spinner />
          </Pane>
        ) : (
          <Pane
            paddingX={16}
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(290px, 1fr))"
            gap={8}
            justifyItems="center"
            alignItems="center"
          >
            {balsToDisplay.length > 0
              ? balsToDisplay.map((id) => {
                  const bal = baseLocalesWithInfosRef.current[id];

                  return (
                    <BaseLocaleCard
                      key={bal.id}
                      isAdmin
                      isShownHabilitationStatus
                      baseLocaleWithInfos={bal as BasesLocalesWithInfos}
                      onRemove={(e) => handleRemove(e, bal.id)}
                      onHide={(e) => handleHide(e, bal.id)}
                    />
                  );
                })
              : "Aucun résultat"}
          </Pane>
        )}

        <Pane display="flex" justifyContent="center" padding={16}>
          <Pagination
            className="home-page-pagination"
            page={currentPage}
            totalPages={Math.ceil(filteredBALs.length / PAGE_SIZE)}
            onPageChange={(newPage) => setCurrentPage(newPage)}
            onPreviousPage={() => setCurrentPage((cur) => cur - 1)}
            onNextPage={() => setCurrentPage((cur) => cur + 1)}
          />
        </Pane>
      </Pane>
    )
  );
}

export default BasesLocalesList;
