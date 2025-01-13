import { useCallback, useContext, useEffect, useState } from "react";
import { reduce, uniqueId } from "lodash";
import { Button, AddIcon, Text, ErrorIcon, Pane } from "evergreen-ui";

import languesRegionales from "@ban-team/shared-data/langues-regionales.json";

import LanguageField from "./language-field";
import BalDataContext from "@/contexts/bal-data";

function objectToArray(obj) {
  if (obj) {
    return Object.keys(obj).map((key) => {
      return { code: key, value: obj[key], id: uniqueId() };
    });
  }

  return [];
}

function languagesArrayToObj(arr) {
  const filtered = arr.filter(({ code, value }) => code && value.length > 0);
  return reduce(
    filtered,
    (acc, current) => ({ ...acc, [current.code]: current.value }),
    {}
  );
}

function getInitialValue(initialValue: any, autoOpen: boolean) {
  if (initialValue) {
    return objectToArray(initialValue);
  } else if (autoOpen) {
    return [{ code: "", value: "", id: uniqueId() }];
  }
  return [];
}

interface LanguesRegionalesFormProps {
  initialValue?: any;
  validationMessage?: string;
  handleLanguages: (value: any) => void;
  autoOpen?: boolean;
}

function LanguesRegionalesForm({
  initialValue,
  validationMessage,
  handleLanguages,
  autoOpen = false,
}: LanguesRegionalesFormProps) {
  const { baseLocale } = useContext(BalDataContext);
  const [nomAlt, setNomAlt] = useState(getInitialValue(initialValue, autoOpen));

  const onAddForm = () => {
    let code: string = null;
    if (
      baseLocale.communeNomsAlt &&
      Object.keys(baseLocale.communeNomsAlt).length > 0
    ) {
      code = Object.keys(baseLocale.communeNomsAlt)[0];
    }
    setNomAlt((prev) => [...prev, { code, value: "", id: uniqueId() }]);
  };

  const onLanguageChange = useCallback(
    ({ code, value }, id) => {
      const index = nomAlt.findIndex((i) => i.id === id);
      const updated = [...nomAlt];
      updated[index] = { code, value, id };

      setNomAlt(updated);
      handleLanguages(languagesArrayToObj(updated));
    },
    [nomAlt, handleLanguages]
  );

  const onRemoveLanguage = useCallback(
    (id) => {
      const filtered = nomAlt.filter((l) => l.id !== id);

      setNomAlt(filtered);
      handleLanguages(languagesArrayToObj(filtered));
    },
    [nomAlt, handleLanguages]
  );

  useEffect(() => {
    handleLanguages(languagesArrayToObj(nomAlt));
  }, [nomAlt, handleLanguages]);

  return (
    <>
      {nomAlt.map((language) => (
        <LanguageField
          key={language.id}
          initialValue={language}
          availableLanguages={languesRegionales.filter(
            ({ code }) => !nomAlt.map(({ code }) => code).includes(code)
          )}
          onChange={(value) => onLanguageChange(value, language.id)}
          onDelete={() => onRemoveLanguage(language.id)}
        />
      ))}

      <Button
        type="button"
        appearance="primary"
        intent="success"
        iconBefore={AddIcon}
        width="100%"
        onClick={onAddForm}
        marginTop="1em"
        disabled={nomAlt.length >= languesRegionales.length}
      >
        Ajouter une langue régionale
      </Button>

      <Pane marginTop={8}>
        {validationMessage && (
          <Text color="danger" fontStyle="italic">
            <ErrorIcon
              size={14}
              color="danger"
              marginRight={4}
              marginBottom={-1}
            />
            {validationMessage}
          </Text>
        )}
      </Pane>
    </>
  );
}

export default LanguesRegionalesForm;
