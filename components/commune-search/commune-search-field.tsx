/* eslint react/boolean-prop-naming: off */
import { Dispatch, SetStateAction, useMemo } from "react";
import { FormField } from "evergreen-ui";

import CommuneSearch from "@/components/commune-search/commune-search";
import { CommuneApiGeoType } from "@/lib/geo-api/type";
import { CommuneSimpleType } from "@/pages/new";

let idCounter = 0;

interface CommuneSearchFieldProps {
  id: string;
  hint: string;
  label: string;
  description?: string;
  validationMessage?: string;
  inputHeight?: string | number;
  inputWidth?: string | number;
  disabled: boolean;
  required: boolean;
  isInvalid?: boolean;
  appearance: string;
  spellCheck?: boolean;

  placeholder: string;
  innerRef: Dispatch<SetStateAction<HTMLInputElement>>;
  initialSelectedItem: CommuneSimpleType;
  onSelect: Dispatch<SetStateAction<CommuneApiGeoType>>;
  [x: string]: any;
}

export function CommuneSearchField({
  // We are using the id from the state
  id: unusedId,
  // FormField props
  hint,
  label,
  description = "",
  validationMessage = null,
  // TextInput props
  inputHeight = 32,
  inputWidth = "100%",
  disabled,
  required,
  isInvalid = false,
  appearance,
  spellCheck = true, // Rest props are spread on the FormField

  placeholder = "Chercher une commune…",
  innerRef,
  initialSelectedItem = null,
  onSelect,
}: CommuneSearchFieldProps) {
  const id = useMemo(
    () => `CommuneSearchField-${unusedId || idCounter++}`,
    [unusedId]
  );
  return (
    <FormField
      marginBottom={24}
      label={label}
      isRequired={required}
      hint={hint}
      description={description}
      validationMessage={validationMessage}
      labelFor={id}
    >
      <CommuneSearch
        id={id}
        innerRef={innerRef}
        placeholder={placeholder}
        initialSelectedItem={initialSelectedItem}
        onSelect={onSelect}
        width={inputWidth}
        height={inputHeight}
        disabled={disabled}
        required={required}
        isInvalid={isInvalid}
        appearance={appearance}
        spellCheck={spellCheck}
      />
    </FormField>
  );
}

export default CommuneSearchField;
