import { useCallback, useState } from "react";

export default function useValidationMessage() {
  const [validationMessages, _setValidationMessages] = useState<Record<
    string,
    string[]
  > | null>(null);

  const setValidationMessages = (messages: string[] | null) => {
    if (messages) {
      for (const message of messages) {
        const field = message.split(":")[0];
        const error = message.split(":")[1];
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
