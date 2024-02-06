import { useState, useCallback } from "react";

export function useInput(
  initialValue?: string
): [string, (e: any) => void, (forcedValue: any) => void] {
  const [value, setValue] = useState<string>(initialValue || "");

  const onChange = useCallback((e) => {
    setValue(e.target.value);
  }, []);

  const resetInput = useCallback(
    (forcedValue) => {
      setValue(forcedValue || initialValue || "");
    },
    [initialValue]
  );

  return [value, onChange, resetInput];
}

export function useCheckboxInput(
  initialValue?: boolean
): [boolean, (e: any) => void] {
  const [checked, setChecked] = useState<boolean>(initialValue || false);

  const onChange = useCallback((e) => {
    setChecked(e.target.checked);
  }, []);

  return [checked, onChange];
}
