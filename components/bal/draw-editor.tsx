import { useContext, useCallback } from "react";
import { Pane, Heading, Button, Alert, EraserIcon } from "evergreen-ui";

import DrawContext from "@/contexts/draw";

function DrawEditor() {
  const { hint, data, setData } = useContext(DrawContext);

  const handleDelete = useCallback(() => {
    setData(null);
  }, [setData]);

  return (
    <Pane borderLeft="default" paddingX={12} marginBottom={12}>
      <Heading is="h4">Tracer de la voie</Heading>

      <Alert
        marginTop={8}
        intent="none"
        title="Utilisez la carte pour dessiner le tracé de la voie"
      >
        {hint}
      </Alert>

      {data && (
        <Button
          type="button"
          appearance="primary"
          intent="danger"
          marginY={8}
          marginRight={12}
          iconBefore={EraserIcon}
          onClick={handleDelete}
        >
          Effacer le tracé
        </Button>
      )}
    </Pane>
  );
}

export default DrawEditor;
