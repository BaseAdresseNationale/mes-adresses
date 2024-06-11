import CustomToast from "@/components/custom-toast";
import useWindowSize from "@/hooks/useWindowSize";
import { ChildrenProps } from "@/types/context";
import { Alert } from "evergreen-ui";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";

const TOAST_DURATION = 2000;

interface Toast {
  intent: "success" | "danger" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

interface LayoutContextType {
  isMobile: boolean;
  isMapFullscreen: boolean;
  setIsMapFullscreen: (value: boolean) => void;
  toaster: (
    fn: () => Promise<any>,
    successMessage: string,
    errorMessage: string,
    onValidationError?: (error: any) => void
  ) => () => Promise<any>;
  toasts: Toast[];
  pushToast: ({ intent, title, message }: Toast) => void;
}

const LayoutContext = React.createContext<LayoutContextType | null>(null);

export function LayoutContextProvider(props: ChildrenProps) {
  const { isMobile } = useWindowSize();
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isClientSide, setIsClientSide] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    const lastToast = toasts[toasts.length - 1];
    const timeoutDuration = lastToast?.duration || TOAST_DURATION;
    const timeout = setTimeout(() => {
      setToasts((toasts) => toasts.slice(1));
    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [toasts]);

  const toaster = useCallback(
    (fn, successMessage, errorMessage, onValidationError) => async () => {
      try {
        const result = await fn();

        setToasts((toasts) => [
          ...toasts,
          { intent: "success", title: successMessage },
        ]);
        return result;
      } catch (error) {
        if (error.status === 400 && onValidationError) {
          onValidationError(error);
          throw error;
        } else {
          setToasts((toasts) => [
            ...toasts,
            {
              intent: "danger",
              title: errorMessage,
              message: error.body?.message,
            },
          ]);
        }
      }
    },
    [setToasts]
  );

  const pushToast = useCallback(
    (newToast: Toast) => {
      setToasts((toasts) => [...toasts, { ...newToast }]);
    },
    [setToasts]
  );

  const value = useMemo(
    () => ({
      isMobile,
      isMapFullscreen,
      setIsMapFullscreen,
      toaster,
      pushToast,
      toasts,
    }),
    [isMapFullscreen, isMobile, pushToast, toaster, toasts]
  );

  return (
    <LayoutContext.Provider value={value} {...props}>
      {isClientSide &&
        document.body &&
        ReactDOM.createPortal(
          <>
            {toasts.map(({ intent, title, message }, index) => (
              <CustomToast key={index} duration={TOAST_DURATION}>
                <Alert intent={intent} title={title}>
                  {message}
                </Alert>
              </CustomToast>
            ))}
          </>,
          document.body
        )}
      {props.children}
    </LayoutContext.Provider>
  );
}

export const LayoutContextConsumer = LayoutContext.Consumer;

export default LayoutContext;
