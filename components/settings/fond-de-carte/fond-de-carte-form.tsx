import { useCallback, useContext, useState, useMemo } from "react";
import { cloneDeep, differenceWith, isEqual } from "lodash";
import { Button, AddIcon, Alert, Pane } from "evergreen-ui";

import { validateSourceWithTempMap } from "@/lib/utils/map";
import RefreshIconRotate from "@/components/sub-header/bal-status/refresh-icon-rotate/refresh-icon-rotate";
import BalDataContext from "@/contexts/bal-data";
import {
  BaseLocaleFondDeCarte,
  BasesLocalesService,
} from "@/lib/openapi-api-bal";
import FondDeCarteField from "./fond-de-carte-field";

function FondDeCarteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { baseLocale, reloadBaseLocale } = useContext(BalDataContext);
  const [fondDeCartesForm, setFondDeCartesForm] = useState<
    BaseLocaleFondDeCarte[]
  >(cloneDeep(baseLocale.settings.fondDeCartes) || []);
  const [errors, setErrors] = useState<
    Record<number, { url: boolean; name: boolean }>
  >({});

  const updateFondDeCartes = useCallback(
    async (fondDeCartes: BaseLocaleFondDeCarte[]) => {
      await BasesLocalesService.updateBaseLocale(baseLocale.id, {
        settings: {
          ...baseLocale.settings,
          fondDeCartes,
        },
      });
      await reloadBaseLocale();
    },
    [baseLocale.id, baseLocale.settings, reloadBaseLocale]
  );

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
      await updateFondDeCartes(fondDeCartesForm);
    }
    setIsLoading(false);
  }, [computeErrors, fondDeCartesForm, updateFondDeCartes]);

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

  const onRemove = useCallback(
    async (index: number) => {
      const filteredFondDeCartesForm = fondDeCartesForm.filter(
        (_, i) => i !== index
      );
      setFondDeCartesForm(filteredFondDeCartesForm);
      await updateFondDeCartes(filteredFondDeCartesForm);
    },
    [fondDeCartesForm, updateFondDeCartes]
  );

  const styleChanged = useMemo(() => {
    return (
      differenceWith(
        fondDeCartesForm,
        baseLocale.settings.fondDeCartes,
        isEqual
      ).length > 0 ||
      fondDeCartesForm?.length !== baseLocale.settings.fondDeCartes?.length
    );
  }, [fondDeCartesForm, baseLocale.settings.fondDeCartes]);

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
      {fondDeCartesForm.length > 0 && (
        <Pane backgroundColor="#FAFBFF">
          {fondDeCartesForm.map((styleMap, index) => (
            <FondDeCarteField
              key={`fond-de-carte-formulaire-${index}`}
              initialValue={styleMap}
              onChange={(key, value) => onChange(index, key, value)}
              onDelete={() => onRemove(index)}
              errors={errors[index]}
            />
          ))}
          <Pane display="flex" justifyContent="flex-end">
            <Button
              disabled={!styleChanged}
              type="button"
              appearance="primary"
              onClick={saveFondDeCartes}
            >
              Enregistrer les Changements {isLoading && <RefreshIconRotate />}
            </Button>
          </Pane>
        </Pane>
      )}
    </>
  );
}

export default FondDeCarteForm;
