import { Pane, Text, Button, WarningSignIcon } from "evergreen-ui";

interface WarningNumeroProps {
  title: string;
  goToFormNumero: () => void;
}

function WarningNumero({ title, goToFormNumero }: WarningNumeroProps) {
  return (
    <>
      <Pane marginBottom={8}>
        <Text color="white">{title}</Text>
      </Pane>
      <Button onClick={goToFormNumero} title="Éditer le numero" size="small">
        Corriger
      </Button>
    </>
  );
}

export default WarningNumero;
