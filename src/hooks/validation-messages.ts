import { useCallback, useState } from "react";

export default function useValidationMessage() {
  const [validationMessages, _setValidationMessages] = useState<Record<
    string,
    string[]
  > | null>(null);

  const setValidationMessages = (messages: string[] | null) => {
    _setValidationMessages(null);
    if (messages) {
      for (const message of messages) {
        let [field, error] = message.split(":");
        if (field.includes("positions")) {
          field = "positions";
        }
        _setValidationMessages((prev) => ({
          ...prev,
          [field]: [...(prev?.[field] || []), error],
        }));
      }
    } else {
      _setValidationMessages(null);
    }
  };

  const getValidationMessage = useCallback(
    (field) => {
      return validationMessages?.[field]?.join(", ");
    },
    [validationMessages]
  );

  return { getValidationMessage, setValidationMessages };
}
