import { useCallback, useContext, useState, useMemo } from "react";
import { uniqueId, cloneDeep, differenceWith, isEqual } from "lodash";
import { Button, AddIcon, Alert, Pane } from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";
import StyleMapField, { StyleMap } from "./style-map-field";
import { validateSourceWithTempMap } from "@/lib/utils/map";

function StyleMapForm() {
  const { styleMaps, setStyleMaps } = useContext(LocalStorageContext);
  const [styleMapsForm, setStyleMapsForm] = useState<StyleMap[]>(
    cloneDeep(styleMaps) || []
  );
  const [errors, setErrors] = useState<
    Record<string, Record<"url" | "name", boolean>>
  >({});

  const computeErrors = useCallback(async () => {
    const urlIsValid = await Promise.all(
      styleMapsForm.map(async (styleMap) => {
        const url = await validateSourceWithTempMap(styleMap);
        const name = Boolean(styleMap.name);
        return [styleMap.id, { url, name }];
      })
    );
    return Object.fromEntries(urlIsValid);
  }, [styleMapsForm]);

  const saveStyleMapsOnLocalStorage = useCallback(async () => {
    const errorsForm: Record<
      string,
      Record<"url" | "name", boolean>
    > = await computeErrors();
    setErrors(errorsForm);
    if (Object.values(errorsForm).every((error) => error.url && error.name)) {
      setStyleMaps(cloneDeep(styleMapsForm));
    }
  }, [computeErrors, setErrors, setStyleMaps, styleMapsForm]);

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
    return (
      differenceWith(styleMapsForm, styleMaps, isEqual).length > 0 ||
      styleMapsForm?.length !== styleMaps?.length
    );
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
        Seul les urls des fluxs WMTS ou WMS sont supportées. Bien préciser le
        type: Raster ou Vector. Les images Raster doivent être 256x256 pixels et
        les images Vector doivent être 512x512 pixels. Voir l&apos;exemple
        ci-dessous.
      </Alert>
      <Pane backgroundColor="#FAFBFF">
        <StyleMapField
          key="example"
          initialValue={{
            id: "example",
            name: "Exemple de fond de carte",
            type: "raster",
            url: "https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
          }}
          onChange={() => {}}
          onDelete={() => {}}
          disabled={true}
        />
        {styleMapsForm.map((styleMap) => (
          <StyleMapField
            key={styleMap.id}
            initialValue={styleMap}
            onChange={(key, value) => onChange(styleMap.id, key, value)}
            onDelete={() => onRemove(styleMap.id)}
            errors={errors[styleMap.id]}
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
