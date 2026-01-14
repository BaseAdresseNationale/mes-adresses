import { Tooltip, Button, ControlIcon } from "evergreen-ui";

interface CadastreControlProps {
  hasCadastre?: boolean;
  isCadastreDisplayed?: boolean;
  onClick: () => void;
}

function CadastreControl({
  hasCadastre,
  isCadastreDisplayed,
  onClick,
}: CadastreControlProps) {
  return hasCadastre ? (
    <Tooltip
      content={
        isCadastreDisplayed ? "Masquer le cadastre" : "Afficher le cadastre"
      }
    >
      <Button
        style={{ padding: ".8em" }}
        onClick={onClick}
        title={
          isCadastreDisplayed ? "Masquer le cadastre" : "Afficher le cadastre"
        }
      >
        <ControlIcon color={isCadastreDisplayed ? "selected" : "muted"} />
      </Button>
    </Tooltip>
  ) : (
    <Tooltip content="Le cadastre n’est pas disponible pour cette commune">
      <Button
        style={{ padding: ".8em" }}
        cursor="not-allowed"
        title="Le cadastre n’est pas disponible pour cette commune"
      >
        <ControlIcon color="muted" />
      </Button>
    </Tooltip>
  );
}

export default CadastreControl;
