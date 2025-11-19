import { useCallback, useContext, useState, useMemo } from "react";
import { uniqueId, cloneDeep, differenceWith, isEqual } from "lodash";
import { Button, AddIcon, Alert, Pane } from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";
import StyleMapField, { StyleMap } from "./style-map-field";

function StyleMapForm() {
  const { styleMaps, setStyleMaps } = useContext(LocalStorageContext);
  const [styleMapsForm, setStyleMapsForm] = useState<StyleMap[]>(
    cloneDeep(styleMaps)
  );

  const saveStyleMapsOnLocalStorage = useCallback(() => {
    setStyleMaps(cloneDeep(styleMapsForm));
  }, [styleMapsForm, setStyleMaps]);

  const onAddForm = () => {
    setStyleMapsForm((prev) => [
      ...prev,
      { id: uniqueId(), name: "", url: "", type: "raster" },
    ]);
  };

  const onChange = useCallback(
    (id: string, key: string, value: string) => {
      const index = styleMapsForm.findIndex((i) => i.id === id);
      const updated = [...styleMapsForm];
      updated[index][key] = value;

      setStyleMapsForm(updated);
    },
    [styleMapsForm]
  );

  const onRemove = useCallback(
    (id: string) => {
      const filtered = styleMapsForm.filter((l) => l.id !== id);

      setStyleMapsForm(filtered);
    },
    [styleMapsForm]
  );

  const styleChanged = useMemo(() => {
    return differenceWith(styleMapsForm, styleMaps, isEqual).length > 0;
  }, [styleMapsForm, styleMaps]);

  return (
    <>
      <Button
        type="button"
        appearance="primary"
        intent="success"
        iconBefore={AddIcon}
        onClick={onAddForm}
        marginBottom={8}
      >
        Ajouter un fond de carte
      </Button>
      <Alert intent="none" title="Comment ca marche les fonds de carte">
        Seul les url des fluxs WMTS ou WMS sont supportés. Bien préciser le
        type: Raster ou Vector. Les images doivent être de hauteur et largeur
        256px.
      </Alert>
      <Pane backgroundColor="#FAFBFF">
        {styleMapsForm.map((styleMap) => (
          <StyleMapField
            key={styleMap.id}
            initialValue={styleMap}
            onChange={(key, value) => onChange(styleMap.id, key, value)}
            onDelete={() => onRemove(styleMap.id)}
          />
        ))}
        <Button
          disabled={!styleChanged}
          type="button"
          appearance="primary"
          onClick={saveStyleMapsOnLocalStorage}
        >
          Enregistrer les Changements
        </Button>
      </Pane>
    </>
  );
}

export default StyleMapForm;
