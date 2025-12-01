import { useCallback, useContext, useState, useMemo } from "react";
import { cloneDeep, differenceWith, isEqual } from "lodash";
import { Button, AddIcon, Alert, Pane } from "evergreen-ui";

import StyleMapField from "./style-map-field";
import { validateSourceWithTempMap } from "@/lib/utils/map";
import RefreshIconRotate from "@/components/sub-header/bal-status/refresh-icon-rotate/refresh-icon-rotate";
import BalDataContext from "@/contexts/bal-data";
import {
  BaseLocaleFondDeCarte,
  BasesLocalesService,
} from "@/lib/openapi-api-bal";

function StyleMapForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { baseLocale, reloadBaseLocale } = useContext(BalDataContext);
  const [fondDeCartesForm, setFondDeCartesForm] = useState<
    BaseLocaleFondDeCarte[]
  >(cloneDeep(baseLocale.settings.fondDeCarte) || []);
  const [errors, setErrors] = useState<
    Record<number, { url: boolean; name: boolean }>
  >({});

  const computeErrors = useCallback(async () => {
    const urlIsValid = await Promise.all(
      fondDeCartesForm.map(async (styleMap, index) => {
        const fluxIsValid = await validateSourceWithTempMap({
          id: `source-${index}`,
          url: styleMap.url,
        });

        const nameIsValid =
          Boolean(styleMap.name) &&
          !["Photographie aérienne", "Plan OpenStreetMap", "Plan IGN"].includes(
            styleMap.name
          ) &&
          fondDeCartesForm
            .slice(0, index)
            .every((s) => s.name !== styleMap.name);
        return [index, { url: fluxIsValid, name: nameIsValid }];
      })
    );
    return Object.fromEntries(urlIsValid);
  }, [fondDeCartesForm]);

  const saveFondDeCartes = useCallback(async () => {
    setIsLoading(true);
    const errorsForm: Record<number, { url: boolean; name: boolean }> =
      await computeErrors();
    setErrors(errorsForm);
    if (Object.values(errorsForm).every((error) => error.url && error.name)) {
      await BasesLocalesService.updateBaseLocale(baseLocale.id, {
        settings: {
          ...baseLocale.settings,
          fondDeCarte: cloneDeep(fondDeCartesForm),
        },
      });
      await reloadBaseLocale();
    }
    setIsLoading(false);
  }, [
    computeErrors,
    baseLocale.id,
    baseLocale.settings,
    fondDeCartesForm,
    reloadBaseLocale,
  ]);

  const onAddForm = () => {
    setFondDeCartesForm((prev) => [...prev, { name: "", url: "" }]);
  };

  const onChange = useCallback(
    (index: number, key: string, value: string) => {
      const updated = [...fondDeCartesForm];
      updated[index][key] = value;

      setFondDeCartesForm(updated);
    },
    [fondDeCartesForm]
  );

  const onRemove = useCallback((index: number) => {
    setFondDeCartesForm((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const styleChanged = useMemo(() => {
    return (
      differenceWith(fondDeCartesForm, baseLocale.settings.fondDeCarte, isEqual)
        .length > 0 ||
      fondDeCartesForm?.length !== baseLocale.settings.fondDeCarte?.length
    );
  }, [fondDeCartesForm, baseLocale.settings.fondDeCarte]);

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
        {fondDeCartesForm.map((styleMap, index) => (
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
          onClick={saveFondDeCartes}
        >
          Enregistrer les Changements {isLoading && <RefreshIconRotate />}
        </Button>
      </Pane>
    </>
  );
}

export default StyleMapForm;
