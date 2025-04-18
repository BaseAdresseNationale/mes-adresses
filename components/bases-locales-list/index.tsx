import {
  useState,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Pagination, Pane, Paragraph, Spinner } from "evergreen-ui";
import LocalStorageContext from "@/contexts/local-storage";
import DeleteWarning from "@/components/delete-warning";
import BaseLocaleCard from "@/components/base-locale-card";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  OpenAPI,
} from "@/lib/openapi-api-bal";
import { fetchBALInfos } from "@/lib/utils/bal";
import LayoutContext from "@/contexts/layout";
import CreateBaseLocaleCard from "./create-bal-card";
import WelcomeIllustration from "../welcome-illustration";

interface BasesLocalesListProps {
  basesLocales: ExtendedBaseLocaleDTO[];
}

export type BasesLocalesWithInfos = ExtendedBaseLocaleDTO &
  Awaited<ReturnType<typeof fetchBALInfos>>;

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
  const { removeBalAccess, getBalToken } = useContext(LocalStorageContext);
  const { toaster } = useContext(LayoutContext);
  const [BALtoRemove, setBALToRemove] = useState<BasesLocalesWithInfos | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const balsToDisplay = useMemo(
    () =>
      basesLocales
        .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
        .map(({ id }) => id),
    [currentPage, basesLocales]
  );

  const totalPages = useMemo(
    () => Math.ceil(basesLocales.length / PAGE_SIZE),
    [basesLocales]
  );

  useEffect(() => {
    async function addBALInfos() {
      setIsLoading(true);
      for (const id of balsToDisplay) {
        try {
          const baseLocale = baseLocalesWithInfosRef.current[id];

          if ((baseLocale as BasesLocalesWithInfos).isLoaded) {
            continue;
          }

          const balInfos = await fetchBALInfos(baseLocale);
          baseLocalesWithInfosRef.current = {
            ...baseLocalesWithInfosRef.current,
            [id]: {
              ...baseLocale,
              ...balInfos,
            } as BasesLocalesWithInfos,
          };
        } catch (error) {
          console.error(`Error fetching infos for BAL ${id}:`, error);
        }
      }
      setIsLoading(false);
    }

    void addBALInfos();
  }, [balsToDisplay]);

  const onRemove = useCallback(async () => {
    if (!BALtoRemove) {
      return;
    }

    const { id: balId, status } = BALtoRemove;
    if (
      status === ExtendedBaseLocaleDTO.status.DRAFT ||
      status === ExtendedBaseLocaleDTO.status.DEMO
    ) {
      const token: string = getBalToken(balId);
      Object.assign(OpenAPI, { TOKEN: token });

      const deleteBaseLocale = toaster(
        async () => {
          await BasesLocalesService.deleteBaseLocale(balId);
          Object.assign(OpenAPI, { TOKEN: null });
          removeBalAccess(balId);
        },
        "La Base Adresse Locale a bien été supprimée",
        "La Base Adresse Locale n’a pas pu être supprimée"
      );

      await deleteBaseLocale();
    }

    removeBalAccess(balId);
    setBALToRemove(null);
  }, [BALtoRemove, getBalToken, removeBalAccess, toaster]);

  const handleRemove = useCallback((balId: string) => {
    const balToRemove = baseLocalesWithInfosRef.current[
      balId
    ] as BasesLocalesWithInfos;

    setBALToRemove(balToRemove);
  }, []);

  return (
    <Pane display="flex" flexDirection="column" flex={1}>
      <DeleteWarning
        isShown={Boolean(BALtoRemove)}
        content={
          BALtoRemove?.status === ExtendedBaseLocaleDTO.status.DRAFT ||
          BALtoRemove?.status === ExtendedBaseLocaleDTO.status.DEMO ? (
            <Paragraph>
              Êtes vous bien sûr de vouloir supprimer cette Base Adresse Locale
              ? Cette action est définitive.
            </Paragraph>
          ) : (
            <Paragraph>
              Êtes vous bien sûr de vouloir masquer cette Base Adresse Locale ?
              Elle n&apos;apparaitra plus sur votre page d&apos;accueil, mais
              vous pourrez toujours la récupérer ultérieurement.
            </Paragraph>
          )
        }
        onCancel={() => setBALToRemove(null)}
        onConfirm={onRemove}
      />

      {isLoading ? (
        <Pane
          display="flex"
          flex={1}
          alignItems="center"
          justifyContent="center"
        >
          <Spinner />
        </Pane>
      ) : (
        <Pane display="flex" flex={1}>
          {basesLocales.length > 0 ? (
            <Pane
              padding={16}
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(290px, 1fr))"
              gap={8}
              justifyItems="center"
              alignItems="center"
              width="100%"
            >
              {balsToDisplay.map((id) => {
                const bal = baseLocalesWithInfosRef.current[id];

                return (
                  <BaseLocaleCard
                    key={bal.id}
                    isAdmin
                    isShownHabilitationStatus
                    baseLocaleWithInfos={bal as BasesLocalesWithInfos}
                    onRemove={() => handleRemove(bal.id)}
                  />
                );
              })}
              <CreateBaseLocaleCard />
            </Pane>
          ) : (
            <Pane display="flex" alignItems="center" width="100%" padding={16}>
              <CreateBaseLocaleCard />
              <WelcomeIllustration />
            </Pane>
          )}
        </Pane>
      )}

      {totalPages > 1 && (
        <Pane display="flex" justifyContent="center" padding={16}>
          <Pagination
            className="home-page-pagination"
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(newPage) => setCurrentPage(newPage)}
            onPreviousPage={() => setCurrentPage((cur) => cur - 1)}
            onNextPage={() => setCurrentPage((cur) => cur + 1)}
          />
        </Pane>
      )}
    </Pane>
  );
}

export default BasesLocalesList;
