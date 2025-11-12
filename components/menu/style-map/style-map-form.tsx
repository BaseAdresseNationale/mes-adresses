import { useCallback, useContext, useState } from "react";
import { uniqueId } from "lodash";
import { Button, AddIcon } from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";
import StyleMapField, { StyleMap } from "./style-map-field";

function StyleMapForm() {
  const { styleMaps, setStyleMaps } = useContext(LocalStorageContext);
  const [styleMapsForm, setStyleMapsForm] = useState<StyleMap[]>(
    styleMaps || []
  );

  const saveStyleMapsOnLocalStorage = useCallback(() => {
    setStyleMaps(styleMapsForm);
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

  return (
    <>
      <Button
        type="button"
        appearance="primary"
        intent="success"
        iconBefore={AddIcon}
        onClick={onAddForm}
      >
        Ajouter un fond de carte
      </Button>
      {styleMapsForm.map((styleMap) => (
        <StyleMapField
          key={styleMap.id}
          initialValue={styleMap}
          onChange={(key, value) => onChange(styleMap.id, key, value)}
          onDelete={() => onRemove(styleMap.id)}
        />
      ))}
      <Button
        type="button"
        appearance="primary"
        onClick={saveStyleMapsOnLocalStorage}
      >
        Enregistrer les Changements
      </Button>
    </>
  );
}

export default StyleMapForm;
