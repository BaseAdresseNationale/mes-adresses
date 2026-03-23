import { Alert, Signalement } from "@/lib/openapi-signalement";
import { SignalementHeader } from "../signalement-header";
import Form from "@/components/form";
import { Button, Pane, Paragraph } from "evergreen-ui";
import { useAlertMap } from "../hooks/useAlertMap";

interface AlertViewerProps {
  alert: Alert;
  author?: Signalement["author"];
  onClose: () => void;
}

export function AlertViewer({ alert, author, onClose }: AlertViewerProps) {
  useAlertMap(alert);

  const createdAddressLabel =
    alert.type === Alert.type.MISSING_ADDRESS &&
    alert.status === Alert.status.PROCESSED
      ? (alert.context?.createdAddress as { label?: string })?.label
      : undefined;

  return (
    <Form
      closeForm={onClose}
      onFormSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        return Promise.resolve();
      }}
    >
      <SignalementHeader signalement={alert} author={author} />

      {createdAddressLabel && (
        <Pane marginTop={8} marginBottom={8}>
          <Paragraph>
            Adresse créée : <b>{createdAddressLabel}</b>
          </Paragraph>
        </Pane>
      )}

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
            Fermer
          </Button>
        </Pane>
      </Pane>
    </Form>
  );
}
