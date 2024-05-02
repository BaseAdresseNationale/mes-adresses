import { useCallback, useState } from "react";

export default function useValidationMessage() {
  const [validationMessages, setValidationMessages] = useState<string[] | null>(null);

  const getValidationMessage = useCallback((field) => {
    if (validationMessages && validationMessages.length > 0) {
      const messages = validationMessages.filter((message) =>
        message.includes(field)
      );
      return messages && messages[0];
    }
  }, [validationMessages]);

  return { getValidationMessage, setValidationMessages };
}
