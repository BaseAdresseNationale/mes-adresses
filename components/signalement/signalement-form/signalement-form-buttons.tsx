import { BadgeSelect } from "@/components/badge-select";
import { DelayBar } from "@/components/delay-bar";
import SignalementContext from "@/contexts/signalement";
import { Signalement } from "@/lib/openapi-signalement";
import {
  BanCircleIcon,
  Button,
  Label,
  Pane,
  Textarea,
  TickCircleIcon,
  Text,
  Select,
} from "evergreen-ui";
import { useContext, useRef, useState } from "react";

interface SignalementFormButtonsProps {
  author?: Signalement["author"];
  isLoading: boolean;
  onAccept: () => Promise<void>;
  onReject: (reason?: string) => Promise<void>;
  onClose: () => void;
}

const CONFIRMATION_DELAY = 8000;

const rejectionReasonsOptions = [
  "Signalement non pertinent",
  "Signalement en double",
  "Signalement déjà traité",
  "Signalement mal positionné",
  "Signalement non conforme",
  "Autre",
] as const;

type RejectionReasonOption = (typeof rejectionReasonsOptions)[number];

export function SignalementFormButtons({
  author,
  isLoading,
  onAccept,
  onReject,
  onClose,
}: SignalementFormButtonsProps) {
  const [actionToConfirm, setActionToConfirm] = useState<
    "accept" | "reject" | null
  >(null);
  const timeOutRef = useRef<NodeJS.Timeout | null>(null);
  const { pendingSignalementsCount } = useContext(SignalementContext);
  const [rejectionReasonSelected, setRejectionReasonSelected] =
    useState<RejectionReasonOption | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const showRejectionReason = actionToConfirm === "reject";

  const handleActionToConfirm = (action: "accept" | "reject") => {
    setActionToConfirm(action);
    const withTimeout = action === "reject";

    if (!withTimeout) {
      timeOutRef.current = setTimeout(() => {
        setActionToConfirm(null);
      }, CONFIRMATION_DELAY);
    }
  };

  const handleConfirm = async () => {
    if (actionToConfirm) {
      if (actionToConfirm === "accept") {
        await onAccept();
      } else if (actionToConfirm === "reject") {
        await onReject(
          rejectionReasonSelected === "Autre"
            ? rejectionReason
            : rejectionReasonSelected
        );
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
        <>
          {showRejectionReason && (
            <Pane
              background="white"
              padding={8}
              borderRadius={8}
              marginBottom={8}
              width="100%"
            >
              <Label htmlFor="reject-reason" marginBottom={8} display="block">
                <Text fontWeight="bold">Raison</Text>
                {author?.email && (
                  <Text marginLeft={4} size={300} color="muted">
                    (L&apos;auteur du signalement recevra cette information par
                    email)
                  </Text>
                )}
              </Label>
              <BadgeSelect
                options={rejectionReasonsOptions}
                onChange={(value: string) =>
                  setRejectionReasonSelected(value as RejectionReasonOption)
                }
                value={rejectionReasonSelected}
              />
              {rejectionReasonSelected === "Autre" && (
                <Textarea
                  id="reject-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Précisez la raison du refus, merci de ne pas indiquer de données personnelles"
                  rows={4}
                  resize="none"
                />
              )}
            </Pane>
          )}
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
                        iconAfter: TickCircleIcon,
                      }
                    : {
                        appearance: "default",
                        intent: "danger",
                        iconAfter: BanCircleIcon,
                      })}
                >
                  {actionToConfirm === "accept" ? "Accepter" : "Refuser"} et{" "}
                  {pendingSignalementsCount > 1
                    ? "passer au suivant"
                    : "terminer"}
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
            {!showRejectionReason && (
              <Pane marginTop={8}>
                <DelayBar delay={`${CONFIRMATION_DELAY}ms`} />
              </Pane>
            )}
          </Pane>
        </>
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
              iconAfter={TickCircleIcon}
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
              Retour
            </Button>
          </Pane>
        </>
      )}
    </Pane>
  );
}
