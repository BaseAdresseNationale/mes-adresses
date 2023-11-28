import RecoverBALAlert from "@/components/bal-recovery/recover-bal-alert";
import { ChildrenProps } from "@/types/context";
import React, { useState, useMemo } from "react";

interface BALRecoveryContextType {
  isRecoveryDisplayed: boolean;
  setIsRecoveryDisplayed: (value: boolean) => void;
}

const BALRecoveryContext = React.createContext<BALRecoveryContextType | null>(
  null
);

interface BALRecoveryProviderProps extends ChildrenProps {
  balId: string;
}

export function BALRecoveryProvider({
  balId,
  ...props
}: BALRecoveryProviderProps) {
  const [isRecoveryDisplayed, setIsRecoveryDisplayed] = useState(false);

  const value = useMemo(
    () => ({
      isRecoveryDisplayed,
      setIsRecoveryDisplayed,
    }),
    [isRecoveryDisplayed]
  );

  return (
    <>
      <RecoverBALAlert
        isShown={isRecoveryDisplayed}
        onClose={() => {
          setIsRecoveryDisplayed(false);
        }}
        baseLocaleId={balId}
      />
      <BALRecoveryContext.Provider value={value} {...props} />
    </>
  );
}

export const BALRecoveryConsumer = BALRecoveryContext.Consumer;

export default BALRecoveryContext;
