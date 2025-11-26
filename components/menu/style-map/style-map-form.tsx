import { useCallback, useContext, useState, useMemo } from "react";
import { uniqueId, cloneDeep, differenceWith, isEqual } from "lodash";
import { Button, AddIcon, Alert, Pane } from "evergreen-ui";

import LocalStorageContext from "@/contexts/local-storage";
import StyleMapField, { StyleMap } from "./style-map-field";
import { validateSourceWithTempMap } from "@/lib/utils/map";
import RefreshIconRotate from "@/components/sub-header/bal-status/refresh-icon-rotate/refresh-icon-rotate";

function StyleMapForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { styleMaps, setStyleMaps } = useContext(LocalStorageContext);
  const [styleMapsForm, setStyleMapsForm] = useState<StyleMap[]>(
    cloneDeep(styleMaps) || []
  );
  const [errors, setErrors] = useState<
    Record<number, { url: boolean; name: boolean }>
  >({});

  const computeErrors = useCallback(async () => {
    const urlIsValid = await Promise.all(
      styleMapsForm.map(async (styleMap, index) => {
        const fluxIsValid = await validateSourceWithTempMap({
          id: `source-${index}`,
          url: styleMap.url,
        });

        const nameIsValid =
          Boolean(styleMap.name) &&
          !["Photographie aérienne", "Plan OpenStreetMap", "Plan IGN"].includes(
            styleMap.name
          ) &&
          styleMapsForm.slice(0, index).every((s) => s.name !== styleMap.name);
        return [index, { url: fluxIsValid, name: nameIsValid }];
      })
    );
    return Object.fromEntries(urlIsValid);
  }, [styleMapsForm]);

  const saveStyleMapsOnLocalStorage = useCallback(async () => {
    setIsLoading(true);
    const errorsForm: Record<number, { url: boolean; name: boolean }> =
      await computeErrors();
    setErrors(errorsForm);
    if (Object.values(errorsForm).every((error) => error.url && error.name)) {
      setStyleMaps(cloneDeep(styleMapsForm));
    }
    setIsLoading(false);
  }, [computeErrors, setErrors, setStyleMaps, styleMapsForm]);

  const onAddForm = () => {
    setStyleMapsForm((prev) => [...prev, { name: "", url: "" }]);
  };

  const onChange = useCallback(
    (index: number, key: string, value: string) => {
      const updated = [...styleMapsForm];
      updated[index][key] = value;

      setStyleMapsForm(updated);
    },
    [styleMapsForm]
  );

  const onRemove = useCallback((index: number) => {
    setStyleMapsForm((prev) => prev.filter((_, i) => i !== index));
  }, []);

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
        Seul les urls des fluxs WMTS ou WMS sont supportées. Les données doivent
        être de type raster et les images de 256x256 pixels. Voir l&apos;exemple
        ci-dessous.
      </Alert>
      <Pane backgroundColor="#FAFBFF">
        {styleMapsForm.map((styleMap, index) => (
          <StyleMapField
            key={`fond-de-carte-formulaire-${index}`}
            initialValue={styleMap}
            onChange={(key, value) => onChange(index, key, value)}
            onDelete={() => onRemove(index)}
            errors={errors[index]}
          />
        ))}
        <Button
          disabled={!styleChanged}
          type="button"
          appearance="primary"
          onClick={saveStyleMapsOnLocalStorage}
        >
          Enregistrer les Changements {isLoading && <RefreshIconRotate />}
        </Button>
      </Pane>
    </>
  );
}

export default StyleMapForm;
