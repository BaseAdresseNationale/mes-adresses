import { useContext, useCallback, useEffect } from "react";
import { Pane, Heading, Button, Alert, EraserIcon } from "evergreen-ui";

import DrawContext, { DrawMode } from "@/contexts/draw";
import { LineString, Voie } from "@/lib/openapi-api-bal";

interface DrawMetricVoieEditorProps {
  voie?: Voie;
}

export function DrawMetricVoieEditor({ voie }: DrawMetricVoieEditorProps) {
  const { hint, data, setData, setDrawMode } = useContext(DrawContext);

  useEffect(() => {
    setDrawMode(DrawMode.DRAW_METRIC_VOIE);

    if (voie?.trace) {
      setData({
        type: "Feature",
        properties: {},
        geometry: voie.trace as LineString,
      });
    } else {
      setData(null);
    }

    return () => {
      setDrawMode(null);
    };
  }, [voie, setData, setDrawMode]);

  const handleDelete = useCallback(() => {
    setData(null);
  }, [setData]);

  return (
    <Pane borderLeft="default" paddingX={12} marginBottom={12}>
      <Heading is="h4">Tracé de la voie</Heading>

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
