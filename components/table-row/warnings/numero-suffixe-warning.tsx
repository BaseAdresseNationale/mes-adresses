import { Pane, Text, Button, WarningSignIcon } from "evergreen-ui";

interface NumeroSuffixeWarningProps {
  onSelect: () => void;
}

function NumeroSuffixeWarning({ onSelect }: NumeroSuffixeWarningProps) {
  return (
    <>
      <Pane marginBottom={8}>
        <WarningSignIcon
          color="white"
          style={{ verticalAlign: "middle" }}
          marginRight={4}
        />
        <Text color="white">Le suffixe du numéro est incorrect</Text>
      </Pane>
      <Button onClick={onSelect} title="Éditer le numero" size="small">
        Corriger
      </Button>
    </>
  );
}

export default NumeroSuffixeWarning;
