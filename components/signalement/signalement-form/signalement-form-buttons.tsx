import { DelayBar } from "@/components/delay-bar";
import { BanCircleIcon, Button, EndorsedIcon, Pane } from "evergreen-ui";
import { useRef, useState } from "react";

interface SignalementFormButtonsProps {
  isLoading: boolean;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
  onClose: () => void;
}

const CONFIRMATION_DELAY = 5000;

export function SignalementFormButtons({
  isLoading,
  onAccept,
  onReject,
  onClose,
}: SignalementFormButtonsProps) {
  const [actionToConfirm, setActionToConfirm] = useState<
    "accept" | "reject" | null
  >(null);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);

  const handleActionToConfirm = (action: "accept" | "reject") => {
    setActionToConfirm(action);
    timeOutRef.current = setTimeout(() => {
      setActionToConfirm(null);
    }, CONFIRMATION_DELAY);
  };

  const handleConfirm = async () => {
    if (actionToConfirm) {
      if (actionToConfirm === "accept") {
        await onAccept();
      } else if (actionToConfirm === "reject") {
        await onReject();
      }
      handleClear();
    }
  };

  const handleClear = () => {
    clearTimeout(timeOutRef.current);
    setActionToConfirm(null);
  };

  return (
    <Pane
      position="sticky"
      bottom={-12}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      paddingY={10}
      backgroundColor="#e6e8f0"
      width="100%"
    >
      {actionToConfirm ? (
        <Pane display="flex" flexDirection="column" width="100%">
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Pane
              margin={4}
              boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
            >
              <Button
                isLoading={isLoading}
                onClick={handleConfirm}
                {...(actionToConfirm === "accept"
                  ? {
                      intent: "success",
                      appearance: "primary",
                      iconAfter: EndorsedIcon,
                    }
                  : {
                      appearance: "default",
                      intent: "danger",
                      iconAfter: BanCircleIcon,
                    })}
              >
                {actionToConfirm === "accept" ? "Accepter" : "Refuser"} et
                passer au suivant
              </Button>
            </Pane>
            <Pane
              margin={4}
              boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
            >
              <Button
                disabled={isLoading}
                type="button"
                appearance="default"
                display="inline-flex"
                onClick={handleClear}
              >
                Annuler
              </Button>
            </Pane>
          </Pane>
          <Pane marginTop={8}>
            <DelayBar delay={`${CONFIRMATION_DELAY}ms`} />
          </Pane>
        </Pane>
      ) : (
        <>
          <Pane
            margin={4}
            boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
          >
            <Button
              onClick={() => handleActionToConfirm("accept")}
              appearance="primary"
              intent="success"
              iconAfter={EndorsedIcon}
            >
              Accepter
            </Button>
          </Pane>

          <Pane
            margin={4}
            boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
          >
            <Button
              type="button"
              appearance="default"
              intent="danger"
              display="inline-flex"
              onClick={() => handleActionToConfirm("reject")}
              iconAfter={BanCircleIcon}
            >
              Refuser
            </Button>
          </Pane>

          <Pane
            margin={4}
            boxShadow="0 0 1px rgba(67, 90, 111, 0.3), 0 5px 8px -4px rgba(67, 90, 111, 0.47)"
          >
            <Button
              type="button"
              appearance="default"
              display="inline-flex"
              onClick={onClose}
            >
              Annuler
            </Button>
          </Pane>
        </>
      )}
    </Pane>
  );
}
