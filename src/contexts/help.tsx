"use client";

import { ChildrenProps } from "@/types/context";
import React, { useState, useMemo } from "react";

interface HelpContextType {
  showHelp: boolean;
  setShowHelp: (value: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (value: number) => void;
}

const HelpContext = React.createContext<HelpContextType>({
  showHelp: false,
  setShowHelp: () => {},
  selectedIndex: 0,
  setSelectedIndex: () => {},
});

export function HelpContextProvider(props: ChildrenProps) {
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const value = useMemo(
    () => ({
      showHelp,
      setShowHelp,
      selectedIndex,
      setSelectedIndex,
    }),
    [showHelp, selectedIndex],
  );

  return <HelpContext.Provider value={value} {...props} />;
}

export const HelpContextConsumer = HelpContext.Consumer;

export default HelpContext;
