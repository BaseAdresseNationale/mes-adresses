import { useCallback, useEffect, useState } from "react";
import { reduce, uniqueId } from "lodash";
import { Button, AddIcon } from "evergreen-ui";

import languesRegionales from "@ban-team/shared-data/langues-regionales.json";

import LanguageField from "./language-field";

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

interface LanguesRegionalesFormProps {
  initialValue?: any;
  validationMessage?: string;
  handleLanguages: (value: any) => void;
}

function LanguesRegionalesForm({
  initialValue,
  validationMessage,
  handleLanguages,
}: LanguesRegionalesFormProps) {
  const [nomAlt, setNomAlt] = useState(objectToArray(initialValue));

  const getAltValidationMessage = useCallback(() => {
    if (validationMessage) {
      return validationMessage.split(" : ")[1]; // Return message without code ISO as prefix
    }
  }, [validationMessage]);

  const onAddForm = () => {
    setNomAlt((prev) => [...prev, { code: null, value: "", id: uniqueId() }]);
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
          validationMessage={getAltValidationMessage()}
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
    </>
  );
}

export default LanguesRegionalesForm;
