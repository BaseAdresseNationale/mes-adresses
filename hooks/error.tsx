import { useState, useEffect } from "react";
import { toaster } from "evergreen-ui";

export default function useError(error: string | null = null) {
  const [err, setError] = useState<string>(error);

  useEffect(() => {
    if (err) {
      toaster.danger("Une erreur est survenue", {
        description: err,
      });
    }
  }, [err]);

  return [setError];
}
