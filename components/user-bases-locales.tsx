import { useState, useEffect, useContext, useCallback } from "react";
import Link from "next/link";
import { map, filter } from "lodash";
import { Pane, Spinner, Button, PlusIcon } from "evergreen-ui";
import LocalStorageContext from "@/contexts/local-storage";
import HiddenBal from "@/components/hidden-bal";
import BasesLocalesList from "@/components/bases-locales-list";
import { BasesLocalesService } from "@/lib/openapi";

function UserBasesLocales() {
  const { balAccess, hiddenBal, getHiddenBal } =
    useContext(LocalStorageContext);

  const [isLoading, setIsLoading] = useState(true);
  const [basesLocales, setBasesLocales] = useState([]);

  const getUserBals = useCallback(async () => {
    setIsLoading(true);
    console.log("getUserBals", balAccess);
    if (balAccess) {
      const balsToLoad = filter(
        Object.keys(balAccess),
        (id) => !getHiddenBal(id)
      );
      const basesLocales = await Promise.all(
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

      const findedBasesLocales = basesLocales.filter((bal) => Boolean(bal));
      setBasesLocales(findedBasesLocales);
    }

    setIsLoading(false);
  }, [balAccess, getHiddenBal]);

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
    <Pane
      display="flex"
      flexDirection="column"
      flex={1}
      justifyContent="flex-start"
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

      {hiddenBal && Object.keys(hiddenBal).length > 0 && <HiddenBal />}
    </Pane>
  );
}

export default UserBasesLocales;
