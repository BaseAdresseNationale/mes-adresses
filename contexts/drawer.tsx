import { ChildrenProps } from "@/types/context";
import React, { useState, useMemo } from "react";

interface DrawerContextType {
  drawerDisplayed: boolean;
  setDrawerDisplayed: (value: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType | null>(null);

export function DrawerContextProvider(props: ChildrenProps) {
  const [drawerDisplayed, setDrawerDisplayed] = useState(false);

  const value = useMemo(
    () => ({
      drawerDisplayed,
      setDrawerDisplayed,
    }),
    [drawerDisplayed]
  );

  return <DrawerContext.Provider value={value} {...props} />;
}

export const DrawerContextConsumer = DrawerContext.Consumer;

export default DrawerContext;
