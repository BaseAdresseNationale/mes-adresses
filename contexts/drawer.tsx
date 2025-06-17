import { ChildrenProps } from "@/types/context";
import React, { useState, useMemo } from "react";

export enum DrawerDisplayedEnum {
  NONE = "",
  DOWNLOAD = "download",
  SETTING = "setting",
  TRASH = "trash",
  SHARE = "share",
}

interface DrawerContextType {
  drawerDisplayed: DrawerDisplayedEnum;
  setDrawerDisplayed: (value: DrawerDisplayedEnum) => void;
}

const DrawerContext = React.createContext<DrawerContextType | null>(null);

export function DrawerContextProvider(props: ChildrenProps) {
  const [drawerDisplayed, setDrawerDisplayed] = useState<DrawerDisplayedEnum>(
    DrawerDisplayedEnum.NONE
  );

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
