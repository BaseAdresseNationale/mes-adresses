import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { ChildrenProps } from "@/types/context";
import React, { useState, useMemo } from "react";

type TabsWithPagination = TabsEnum.VOIES | TabsEnum.TOPONYMES;

interface SearchPaginationContextType {
  setSavedSearchPagination: React.Dispatch<
    React.SetStateAction<
      Record<TabsWithPagination, { page: number; search: string }>
    >
  >;
  savedSearchPagination: Record<
    TabsWithPagination,
    { page: number; search: string }
  >;
  setLastSelectedItem: React.Dispatch<
    React.SetStateAction<Record<TabsWithPagination, string | null>>
  >;
  lastSelectedItem: React.SetStateAction<
    Record<TabsWithPagination, string | null>
  >;
}

const SearchPaginationContext =
  React.createContext<SearchPaginationContextType | null>(null);

export function SearchPaginationContextProvider(props: ChildrenProps) {
  const [lastSelectedItem, setLastSelectedItem] = useState<
    Record<TabsWithPagination, string | null>
  >({
    [TabsEnum.VOIES]: null,
    [TabsEnum.TOPONYMES]: null,
  });

  const [savedSearchPagination, setSavedSearchPagination] = useState<
    Record<TabsWithPagination, { page: number; search: string }>
  >({
    [TabsEnum.VOIES]: { page: 1, search: "" },
    [TabsEnum.TOPONYMES]: { page: 1, search: "" },
  });

  const value = useMemo(
    () => ({
      savedSearchPagination,
      setSavedSearchPagination,
      lastSelectedItem,
      setLastSelectedItem,
    }),
    [
      savedSearchPagination,
      setSavedSearchPagination,
      lastSelectedItem,
      setLastSelectedItem,
    ]
  );

  return <SearchPaginationContext.Provider value={value} {...props} />;
}

export const SearchPaginationContextConsumer = SearchPaginationContext.Consumer;

export default SearchPaginationContext;
