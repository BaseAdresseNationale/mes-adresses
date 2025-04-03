import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import { Pane, Spinner, Button, PlusIcon } from "evergreen-ui";
import LocalStorageContext from "@/contexts/local-storage";
import BasesLocalesList from "@/components/bases-locales-list";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import { sortBalByUpdate } from "@/lib/utils/sort-bal";
import HomeDrawer from "./home-drawer";

function UserBasesLocales() {
  const { balAccess } = useContext(LocalStorageContext);
  const [isLoading, setIsLoading] = useState(true);
  const [basesLocales, setBasesLocales] = useState([]);

  const getUserBals = useCallback(async () => {
    setIsLoading(true);
    if (balAccess) {
      const basesLocales: BaseLocale[] = await Promise.all(
        Object.keys(balAccess).map(async (id) => {
          const token = balAccess[id];
          try {
            const baseLocale = await BasesLocalesService.findBaseLocale(
              id,
              true
            );

            return {
              ...baseLocale,
              token,
            };
          } catch {
            console.log(`Impossible de récupérer la bal ${id}`);
          }
        })
      );

      const orderedBALs = sortBalByUpdate(basesLocales.filter(Boolean));

      setBasesLocales(orderedBALs);
    }

    setIsLoading(false);
  }, [balAccess]);

  useEffect(() => {
    if (balAccess !== undefined) {
      getUserBals();
    }
  }, [balAccess, getUserBals]);

  if (balAccess === undefined || isLoading) {
    return (
      <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
        <Spinner />
      </Pane>
    );
  }

  return (
    <Pane position="relative" display="flex" overflow="hidden">
      <Pane
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="flex-start"
        overflowY="auto"
      >
        {basesLocales.length > 0 ? (
          <BasesLocalesList basesLocales={basesLocales} />
        ) : (
          <Link legacyBehavior href="/new" passHref>
            <Button
              margin="auto"
              height={40}
              appearance="primary"
              iconBefore={PlusIcon}
              is="a"
            >
              Créer une Base Adresse Locale
            </Button>
          </Link>
        )}
      </Pane>
      <HomeDrawer />
    </Pane>
  );
}

export default UserBasesLocales;
