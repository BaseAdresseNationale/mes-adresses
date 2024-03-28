import { useState, useCallback, useEffect, useContext } from "react";

import BalDataContext from "@/contexts/bal-data";

export default function useFormState() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editedNumero, setEditedINumero] = useState(null);

  const { numeros, editingId } = useContext(BalDataContext);

  const handleEditing = useCallback(
    (numeroId?: string) => {
      const editedNumero = numeros.find(({ _id }) => _id === numeroId) || null;
      setEditedINumero(editedNumero);
      setIsFormOpen(true);
    },
    [numeros]
  );

  const reset = useCallback(() => {
    setIsFormOpen(false);
    setEditedINumero(null);
  }, []);

  // Open form when numero is selected from map
  useEffect(() => {
    if (editingId && numeros.map(({ _id }) => _id).includes(editingId)) {
      handleEditing(editingId);
    }
    // HandleEditing has been removed from the list
    // to avoid being retriggered by `numeros` update when form is sumbitted
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { isFormOpen, handleEditing, editedNumero, reset };
}
