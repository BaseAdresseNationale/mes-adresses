import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import useFuse from "./fuse";
import { useDebouncedCallback } from "use-debounce";
import { Toponyme, Voie } from "@/lib/openapi-api-bal";

export const QUERY_PAGE = "page";
export const QUERY_SEARCH = "search";

type UsePaginationType = [
  page: number,
  changePage: (page: number) => void,
  search: string | null,
  changeFilter: (page: string) => void,
  filtered: Array<Toponyme | Voie>,
];

export function useSearchPagination(
  items: Array<Toponyme | Voie>
): UsePaginationType {
  const router = useRouter();
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
    [, router]
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
