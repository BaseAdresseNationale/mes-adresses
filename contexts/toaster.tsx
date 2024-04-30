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
}

const ToasterContext = React.createContext<ToasterContextType | null>(null);

export function ToasterContextProvider(props: ChildrenProps) {
  const [isClientSide, setIsClientSide] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setIsClientSide(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToasts((toasts) => toasts.slice(1));
    }, 5000);
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
            { intent: "danger", title: errorMessage, message: error.message },
          ]);
        }
      }
    },
    [setToasts]
  );

  const value = useMemo(
    () => ({
      toaster,
      toasts,
    }),
    [toaster, toasts]
  );

  return (
    <ToasterContext.Provider value={value} {...props}>
      {isClientSide &&
        document.body &&
        ReactDOM.createPortal(
          <Pane>
            {toasts.map((toast, index) => (
              <Alert
                key={index}
                intent={toast.intent}
                title={toast.title}
                position="fixed"
                top={20}
                left="50%"
                transform="translateX(-50%)"
                transition="top 0.3s"
              >
                {toast.message}
              </Alert>
            ))}
          </Pane>,
          document.body
        )}
      {props.children}
    </ToasterContext.Provider>
  );
}

export default ToasterContext;
