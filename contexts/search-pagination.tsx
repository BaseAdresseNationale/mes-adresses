import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { ChildrenProps } from "@/types/context";
import React, { useState, useMemo, useCallback } from "react";

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
  scrollAndHighlightLastSelectedItem: (tab: TabsWithPagination) => void;
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

  const scrollAndHighlightLastSelectedItem = useCallback(
    (tab: TabsWithPagination) => {
      const lastSelectedItemId = lastSelectedItem[tab];
      if (lastSelectedItemId) {
        const element = document.getElementById(lastSelectedItemId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          element.style.border = "1px solid #0070f3"; // Highlight the selected row
        }
      }
    },
    [lastSelectedItem]
  );

  const value = useMemo(
    () => ({
      savedSearchPagination,
      setSavedSearchPagination,
      scrollAndHighlightLastSelectedItem,
      setLastSelectedItem,
    }),
    [
      savedSearchPagination,
      setSavedSearchPagination,
      scrollAndHighlightLastSelectedItem,
      setLastSelectedItem,
    ]
  );

  return <SearchPaginationContext.Provider value={value} {...props} />;
}

export const SearchPaginationContextConsumer = SearchPaginationContext.Consumer;

export default SearchPaginationContext;
