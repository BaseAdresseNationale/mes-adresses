import CustomToast from "@/components/custom-toast";
import { ChildrenProps } from "@/types/context";
import { Alert, Pane } from "evergreen-ui";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import ReactDOM from "react-dom";

interface ToasterContextType {
  toaster: (
    fn: () => Promise<any>,
    successMessage: string,
    errorMessage: string,
    onValidationError?: (error: any) => void
  ) => () => Promise<any>;
  toasts: { intent: "success" | "danger"; title: string; message?: string }[];
  pushToast: (
    intent: "success" | "danger",
    title: string,
    message?: string
  ) => void;
}

const ToasterContext = React.createContext<ToasterContextType | null>(null);

const TOAST_DURATION = 3000;

export function ToasterContextProvider(props: ChildrenProps) {
  const [isClientSide, setIsClientSide] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToasts((toasts) => toasts.slice(1));
    }, TOAST_DURATION);

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
              message: error.message,
            },
          ]);
        }
      }
    },
    [setToasts]
  );

  const pushToast = useCallback(
    (intent, title, message) => {
      setToasts((toasts) => [...toasts, { intent, title, message }]);
    },
    [setToasts]
  );

  const value = useMemo(
    () => ({
      toaster,
      pushToast,
      toasts,
    }),
    [toaster, toasts, pushToast]
  );

  return (
    <ToasterContext.Provider value={value} {...props}>
      {isClientSide &&
        document.body &&
        ReactDOM.createPortal(
          <Pane>
            {toasts.map(({ intent, title, message }, index) => (
              <CustomToast key={index} duration={TOAST_DURATION}>
                <Alert intent={intent} title={title}>
                  {message}
                </Alert>
              </CustomToast>
            ))}
          </Pane>,
          document.body
        )}
      {props.children}
    </ToasterContext.Provider>
  );
}

export default ToasterContext;
