"use client";

import { TabsEnum } from "@/components/sidebar/main-tabs/main-tabs";
import { ChildrenProps } from "@/types/context";
import React, { useState, useMemo, useCallback } from "react";

export type TabsWithPagination = TabsEnum.VOIES | TabsEnum.TOPONYMES;

const scrollAndHighlightElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    element.style.border = "1px solid #0070f3"; // Highlight the selected row

    return true;
  }

  return false;
};

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
      const listElem = document.getElementById(`${tab}-list`);
      const lastSelectedItemId = lastSelectedItem[tab];
      if (!listElem || !lastSelectedItemId) {
        return;
      }

      if (!scrollAndHighlightElement(lastSelectedItemId)) {
        const observer = new MutationObserver(function (mutationsList) {
          for (const mutation of mutationsList) {
            if (mutation.type == "childList") {
              if (scrollAndHighlightElement(lastSelectedItemId)) {
                observer.disconnect();
              }
            }
          }
        });
        observer.observe(listElem, { childList: true });
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
