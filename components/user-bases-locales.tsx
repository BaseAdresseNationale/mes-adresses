import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import { map, filter } from "lodash";
import { Pane, Spinner, Button, PlusIcon } from "evergreen-ui";
import LocalStorageContext from "@/contexts/local-storage";
import BasesLocalesList from "@/components/bases-locales-list";
import { BaseLocale, BasesLocalesService } from "@/lib/openapi-api-bal";
import { sortBalByUpdate } from "@/lib/utils/sort-bal";
import HomeDrawer from "./home-drawer";

const DRAWER_WIDTH = 410;

function UserBasesLocales() {
  const { balAccess, getHiddenBal } = useContext(LocalStorageContext);
  const [isHomeDrawerExpanded, setIsHomeDrawerExpanded] = useState(true);

  const isHidden = useCallback(
    (balId) => {
      return getHiddenBal(balId);
    },
    [getHiddenBal]
  );

  const [isLoading, setIsLoading] = useState(true);
  const [basesLocales, setBasesLocales] = useState([]);

  const getUserBals = useCallback(async () => {
    setIsLoading(true);
    if (balAccess) {
      const balsToLoad = filter(
        Object.keys(balAccess),
        (id) => !getHiddenBal(id)
      );
      const basesLocales: BaseLocale[] = await Promise.all(
        map(balsToLoad, async (id) => {
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

      const filteredBALs = basesLocales.filter(
        (bal) => Boolean(bal) && Boolean(!isHidden(bal.id))
      );

      const orderedBALs = sortBalByUpdate(filteredBALs);

      setBasesLocales(orderedBALs);
    }

    setIsLoading(false);
  }, [balAccess, getHiddenBal, isHidden]);

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
    <Pane position="relative" display="flex" height="100%">
      <Pane
        display="flex"
        flexDirection="column"
        flex={1}
        justifyContent="flex-start"
        marginRight={isHomeDrawerExpanded ? DRAWER_WIDTH : 0}
        transition="margin-right 0.3s ease"
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
      <HomeDrawer
        drawerWidth={DRAWER_WIDTH}
        isExpanded={isHomeDrawerExpanded}
        setIsExpanded={setIsHomeDrawerExpanded}
      />
    </Pane>
  );
}

export default UserBasesLocales;
