import { Pane, TextInputField } from "evergreen-ui";

import useCaretPosition from "@/hooks/caret-position";
import AccentTool from "@/components/accent-tool";

interface AssistedTextFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  validationMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  forwadedRef: React.RefObject<HTMLInputElement>;
  isDisabled?: boolean;
  isRequired?: boolean;
  exitFocus: () => void;
}

function AssistedTextField({
  label,
  forwadedRef,
  placeholder = "",
  value,
  validationMessage = null,
  onChange,
  isDisabled = false,
  isRequired = true,
  exitFocus,
}: AssistedTextFieldProps) {
  const { updateCaretPosition } = useCaretPosition({
    initialValue: value,
    ref: forwadedRef,
  });

  const handleChangeAccent = (e) => {
    onChange(e);
    updateCaretPosition();
  };

  return (
    <Pane display="flex" alignItems="flex-start">
      <TextInputField
        ref={forwadedRef}
        required={isRequired}
        flex={1}
        marginBottom={0}
        disabled={isDisabled}
        label={label}
        placeholder={placeholder}
        value={value}
        isInvalid={Boolean(validationMessage)}
        validationMessage={validationMessage}
        onChange={onChange}
        onBlur={exitFocus}
      />
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginLeft={8}
        marginTop={label.length > 0 ? 26 : 8}
      >
        <AccentTool
          input={value}
          handleAccent={handleChangeAccent}
          updateCaret={updateCaretPosition}
          isDisabled={isDisabled}
          forwadedRef={forwadedRef}
        />
      </Pane>
    </Pane>
  );
}

export default AssistedTextField;
