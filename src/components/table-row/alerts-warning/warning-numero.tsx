import { Pane, Text, Button, defaultTheme } from "evergreen-ui";

interface WarningNumeroProps {
  title: string;
  goToFormNumero: () => void;
}

function WarningNumero({ title, goToFormNumero }: WarningNumeroProps) {
  return (
    <>
      <Pane marginBottom={8}>
        <Text>{title}</Text>
      </Pane>
      <Button
        onClick={goToFormNumero}
        title="Éditer le numero"
        size="small"
        appearance="primary"
        style={{ backgroundColor: defaultTheme.colors.purple600 }}
      >
        Ameliorer
      </Button>
    </>
  );
}

export default WarningNumero;
