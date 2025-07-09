import { useRouter } from "next/router";
import { useCallback, useContext, useEffect } from "react";
import useFuse from "./fuse";
import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import SearchPaginationContext from "@/contexts/search-pagination";

export const QUERY_PAGE = "page";
export const QUERY_SEARCH = "search";

type UsePaginationType<T> = [
  page: number,
  changePage: (page: number) => void,
  search: string | null,
  changeFilter: (page: string) => void,
  filtered: Array<T>,
];

export function getLinkWithPagination(
  href: string,
  savedSearchPagination: { page: number; search: string }
): string {
  const { page, search } = savedSearchPagination;

  if (page > 1) {
    href += `?${QUERY_PAGE}=${page}`;
  }

  if (search) {
    if (href.includes("?")) {
      href += `&${QUERY_SEARCH}=${encodeURIComponent(search)}`;
    } else {
      href += `?${QUERY_SEARCH}=${encodeURIComponent(search)}`;
    }
  }

  return href;
}

export function useSearchPagination<T>(
  tab: TabsEnum,
  items: Array<T>
): UsePaginationType<T> {
  const router = useRouter();
  const { setSavedSearchPagination } = useContext(SearchPaginationContext);

  let page = Number(router.query?.page as string) || 1;
  const search: string = (router.query?.search as string) || "";
  const [filtered, setFilter] = useFuse(
    items,
    200,
    {
      keys: ["nom"],
    },
    search
  );

  useEffect(() => {
    setSavedSearchPagination((prev) => ({
      ...prev,
      [tab]: { page, search },
    }));
  }, [search, page, tab, setSavedSearchPagination]);

  const changePage = useCallback(
    (change: number) => {
      if (change == 1) {
        delete router.query[QUERY_PAGE];
      } else {
        router.query[QUERY_PAGE] = String(change);
      }
      router.push(router, undefined, { shallow: true });
      page = change;
    },
    [router]
  );

  const changeFilter = useCallback(
    (change: string) => {
      if (!change || change == "") {
        delete router.query[QUERY_SEARCH];
      } else {
        router.query[QUERY_SEARCH] = change;
      }
      router.push(router, undefined, { shallow: true });
      setFilter(change);
      changePage(1);
    },
    [setFilter, router, changePage]
  );

  return [page, changePage, search, changeFilter, filtered];
}
