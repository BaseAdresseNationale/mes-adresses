import { useState, useCallback, useContext, useMemo } from "react";
import { Pagination, Pane, Paragraph } from "evergreen-ui";
import LocalStorageContext from "@/contexts/local-storage";
import DeleteWarning from "@/components/delete-warning";
import BaseLocaleCard from "@/components/base-locale-card";
import {
  BasesLocalesService,
  ExtendedBaseLocaleDTO,
  OpenAPI,
} from "@/lib/openapi-api-bal";
import LayoutContext from "@/contexts/layout";
import CreateBaseLocaleCard from "./create-bal-card";
import WelcomeIllustration from "../welcome-illustration";

interface BasesLocalesListProps {
  initialBasesLocales: ExtendedBaseLocaleDTO[];
}

const PAGE_SIZE = 8;

function BasesLocalesList({ initialBasesLocales }: BasesLocalesListProps) {
  const [basesLocales, setBasesLocales] = useState(initialBasesLocales);
  const [currentPage, setCurrentPage] = useState(1);
  const { removeBalAccess, getBalToken } = useContext(LocalStorageContext);
  const { toaster } = useContext(LayoutContext);
  const [BALtoRemove, setBALToRemove] = useState<ExtendedBaseLocaleDTO | null>(
    null
  );

  const displayedBALs = useMemo(
    () =>
      basesLocales.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
      ),
    [currentPage, basesLocales]
  );

  const totalPages = useMemo(
    () => Math.ceil(basesLocales.length / PAGE_SIZE),
    [basesLocales]
  );

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
        },
        "La Base Adresse Locale a bien été supprimée",
        "La Base Adresse Locale n’a pas pu être supprimée"
      );

      await deleteBaseLocale();
    }

    removeBalAccess(balId);
    setBasesLocales((prev) =>
      prev.filter((baseLocale) => baseLocale.id !== balId)
    );
    setBALToRemove(null);
  }, [BALtoRemove, getBalToken, removeBalAccess, toaster]);

  const handleRemove = useCallback(
    (balId: string) => {
      const balToRemove = basesLocales.find((bal) => bal.id === balId);

      setBALToRemove(balToRemove);
    },
    [basesLocales]
  );

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
            {displayedBALs.map((baseLocale) => {
              return (
                <BaseLocaleCard
                  key={baseLocale.id}
                  baseLocale={baseLocale}
                  onRemove={() => handleRemove(baseLocale.id)}
                />
              );
            })}
            <CreateBaseLocaleCard />
          </Pane>
        ) : (
          <Pane
            display="flex"
            justifyContent="space-around"
            alignItems="center"
            width="100%"
            padding={16}
          >
            <CreateBaseLocaleCard />
            <WelcomeIllustration />
          </Pane>
        )}
      </Pane>

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
